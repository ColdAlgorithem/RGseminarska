import { vec3, mat4 } from '../../lib/gl-matrix-module.js';
import { WebGL } from '../../common/engine/WebGL.js';
import { shaders } from './shaders.js';
import { Light } from './Light.js';
import { Model } from './Model.js';

export class Renderer {

    constructor(gl) {
        this.gl = gl;

        gl.clearColor(1, 1, 1, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        this.programs = WebGL.buildPrograms(gl, shaders);

        this.defaultTexture = WebGL.createTexture(gl, {
            width  : 1,
            height : 1,
            data   : new Uint8Array([255, 255, 255, 255])
        });
    }

    prepare(scene) {
        scene.nodes.forEach(node => {
            node.gl = {};
            if (node.mesh) {
                Object.assign(node.gl, this.createModel(node.mesh));
            }
            if (node.image) {
                node.gl.texture = this.createTexture(node.image);
            }
        });
    }

    render(scene, camera){
        this.renderScean(scene, camera);
    }

    renderScean(scene, camera) {
        const gl = this.gl;

        var fogColor = [0.8, 0.9, 1, 1];
        var settings = {
          fogDens: 0.6,
        };

        gl.clearColor(...fogColor);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const program = this.programs.simple;
        gl.useProgram(program.program);

        var fogColorLocation = gl.getUniformLocation(program.program, "u_fogColor");
        var fogDens = gl.getUniformLocation(program.program, "u_fogDensity");
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, camera.projection);
        gl.uniform4fv(fogColorLocation, fogColor);
        gl.uniform1f(fogDens, settings.fogDens);

        let matrix = mat4.create();
        let matrixStack = [];

        const viewMatrix = camera.getGlobalTransform();
        mat4.invert(viewMatrix, viewMatrix);
        mat4.copy(matrix, viewMatrix);
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, camera.projection);
        
        let lightCounter = 0;
        scene.traverse(
            node => {
                matrixStack.push(mat4.clone(matrix));
                mat4.mul(matrix, matrix, node.transform);
                if (node instanceof Model) {
                    gl.bindVertexArray(node.gl.vao);
                    gl.uniformMatrix4fv(program.uniforms.uViewModel, false, matrix);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, node.gl.texture);
                    gl.uniform1i(program.uniforms.uTexture, 0);
                    gl.drawElements(gl.TRIANGLES, node.gl.indices, gl.UNSIGNED_SHORT, 0);
                }
                else if(node instanceof Light){
                    let color = vec3.clone(node.ambientColor);
                    vec3.scale(color, color, 1.0 / 255.0);
                    gl.uniform3fv(program.uniforms['uAmbientColor[' + lightCounter + ']'], color);
                    color = vec3.clone(node.diffuseColor);
                    vec3.scale(color, color, 1.0 / 255.0);
                    gl.uniform3fv(program.uniforms['uDiffuseColor[' + lightCounter + ']'], color);
                    color = vec3.clone(node.specularColor);
                    vec3.scale(color, color, 1.0 / 255.0);
                    gl.uniform3fv(program.uniforms['uSpecularColor[' + lightCounter + ']'], color);
                    let position = [0,0,0];
                    mat4.getTranslation(position, node.transform);
                    gl.uniform3fv(program.uniforms['uLightPosition[' + lightCounter + ']'], position);
                    gl.uniform1f(program.uniforms['uShininess[' + lightCounter + ']'], node.shininess);
                    gl.uniform1f(program.uniforms['Ka[' + lightCounter + ']'], node.Ka);
                    gl.uniform1f(program.uniforms['Kd[' + lightCounter + ']'], node.Kd);
                    gl.uniform1f(program.uniforms['Ks[' + lightCounter + ']'], node.Ks);
                    gl.uniform3fv(program.uniforms['uLightAttenuation[' + lightCounter + ']'], node.attenuatuion);
                    lightCounter++;
                }
            },
            node => {
                matrix = matrixStack.pop();
            }
        );
    }

    createModel(model) {
        const gl = this.gl;

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.texcoords), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

        const indices = model.indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

        return { vao, indices };
    }

    createTexture(texture) {
        const gl = this.gl;
        return WebGL.createTexture(gl, {
            image : texture,
            min   : gl.NEAREST,
            mag   : gl.NEAREST
        });
    }

}
