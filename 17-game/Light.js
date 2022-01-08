import { Node } from './Node.js';

export class Light extends Node {

    constructor() {
        super();
        Object.assign(this, {
            ambientColor     : [255, 255, 255],
            diffuseColor     : [25, 25, 25],
            specularColor    : [25, 25 ,25],
            shininess        : 10,
            Ka               : 1,
            Kd               : 1,
            Ks               : 1,
            attenuatuion     : [1.0, 0, 0.02]
        });
    }

}