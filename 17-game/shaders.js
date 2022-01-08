const vertex = `#version 300 es
precision mediump float;
layout (location = 0) in vec4 aPosition;
layout (location = 2) in vec3 aNormal;
layout (location = 1) in vec2 aTexCoord;


uniform mat4 uViewModel;
uniform mat4 uProjection;

out vec3 vVertexPosition;
out vec3 vNormal;
out vec2 vTexCoord;
out vec3 v_position;


void main() {
    vVertexPosition = (uViewModel * aPosition).xyz;
    vNormal = mat3(uViewModel)*aNormal;
    vTexCoord = aTexCoord;
    gl_Position = uProjection * vec4(vVertexPosition, 1);
    v_position = -(uViewModel * aPosition).xyz;
}
`;

const fragment = `#version 300 es
precision mediump float;

uniform mat4 uViewModel;

uniform mediump sampler2D uTexture;

uniform vec3 uAmbientColor[4];
uniform vec3 uDiffuseColor[4];
uniform vec3 uSpecularColor[4];

uniform float uShininess[4];
uniform vec3 uLightPosition[4];
uniform vec3 uLightAttenuation[4];

uniform float Ka[4];   
uniform float Kd[4];   
uniform float Ks[4]; 

in vec3 vVertexPosition;
in vec3 vNormal;
in vec2 vTexCoord;
in vec3 v_position;

uniform vec4 u_fogColor;
uniform float u_fogDensity;

out vec4 oColor;

void main() {

    #define LOG2 1.442695
    oColor = vec4(0.0);
    int i=0;
    for(int i=0;i<4;i++){
        vec3 lightPosition = (uViewModel * vec4(uLightPosition[0], 1)).xyz;
        float d = distance(vVertexPosition, lightPosition);
        float attenuation = 1.0 / dot(uLightAttenuation[i], vec3(1, d, d * d));

        vec3 N = (uViewModel * vec4(vNormal, 0)).xyz;
        vec3 L = normalize(lightPosition - vVertexPosition);
        float lambert = max(0.0, dot(L, N));
        float phong = 0.0;
        if(lambert>0.0){
            vec3 R = normalize(reflect(-L, N));
            vec3 E = normalize(-vVertexPosition);
            phong = pow(max(0.0, dot(E, R)), uShininess[i]);
        }
        vec3 ambient = uAmbientColor[i] * Ka[i];
        vec3 diffuse = uDiffuseColor[i] * lambert * Kd[i];
        vec3 specular = uSpecularColor[i] * phong * Ks[i];

        vec3 light = (ambient + diffuse + specular) * attenuation;
        oColor += (texture(uTexture, vTexCoord) * vec4(light, 1));
    }

    float fogDistance = length(v_position);
    float fogAmount = 1. - exp2(-u_fogDensity * u_fogDensity * fogDistance * fogDistance * LOG2);
    fogAmount = clamp(fogAmount, 0., 1.);
    oColor = mix(oColor,u_fogColor,fogAmount);
}
`;

const vertexSkyBox=`#version 300 es
precision highp float;

in vec4 a_position;
out vec4 v_position;
void main() {
  v_position = a_position;
  gl_Position = a_position;
  gl_Position.z = 1.0;
}
`;

const fragmentSkyBox=`#version 300 es
precision highp float;

uniform samplerCube u_skybox;
uniform mat4 u_viewDirectionProjectionInverse;

in vec4 v_position;

out vec4 outColor;

void main() {
  vec4 t = u_viewDirectionProjectionInverse * v_position;
  outColor = texture(u_skybox, normalize(t.xyz / t.w));
}`;

export const shaders = {
    simple: { vertex:vertex, 
              fragment:fragment
    },
};
