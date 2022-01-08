import { Node } from './Node.js';

export class Model extends Node {

    constructor(mesh, image, options,visible=true) {
        super(options);
        this.mesh = mesh;
        this.image = image;
        this.visible = visible;
    }

}
