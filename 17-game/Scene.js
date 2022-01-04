export class Scene {

    constructor() {
        this.nodes = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    traverse(before, after) {
        this.nodes.forEach(node => node.traverse(before, after));
    }
    removeNode(index){
        this.nodes.splice(index,1);
    }
}