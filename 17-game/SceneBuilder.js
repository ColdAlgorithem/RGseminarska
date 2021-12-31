import { Mesh } from './Mesh.js';
import { Light } from './Light.js';
import { Node } from './Node.js';
import { Model } from './Model.js';
import { Camera } from './Camera.js';
import { Floor } from './Floor.js';
import { Scene } from './Scene.js';

export class SceneBuilder {

    constructor(spec) {
        this.spec = spec;
    }

    createNode(spec) {
        switch (spec.type) {
            case 'camera': return new Camera(spec);
            case 'model': {
                const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                const texture = this.spec.textures[spec.texture];
                return new Model(mesh, texture, spec);
            }
            case 'target': {
                const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                const texture = this.spec.textures[spec.texture];
                return new Model(mesh, texture, spec);
            }
            case 'floor':{
                const floor = new Floor(50,50)
                const floorTexture = this.spec.textures[spec.texture]
                return new Model(floor,floorTexture,spec)
            }
            default: return new Node(spec);
        }
    }

    build() {
        let scene = new Scene();
        this.spec.nodes.forEach(spec => scene.addNode(this.createNode(spec)));
        return scene;
    }

}
