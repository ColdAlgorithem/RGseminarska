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
    removeNode(node){

        let index = this.nodes.indexOf(node);
        for(let i = 0; i<this.nodes.length;i++){
            if (node == this.nodes[i]){
                index=i;
                break;
            }
        }
        console.log(index);
        this.nodes.splice(index,1);
    }
}