import {mat4} from '../../lib/gl-matrix-module.js'

export class Enity{
    constructor(health=100,alive=true,eNode){
        this.health = health;
        this.alive = alive;
        this.eNode = eNode;
    }

    death(){
        this.alive = this.health>0;
    }
}

export class runner extends Enity{
    constructor(health=50,alive=true,dmg=20,attackRadius=0,eNode){
        super();
        this.health = health;
        this.alive = alive;
        this.dmg=dmg;
        this.attackRadius=attackRadius;
        this.eNode = eNode;
    }

    action(player){
        if(this.distToP(mat4.getTranslation(player.translation, player.transform),mat4.getTranslation(this.eNode.translation, this.eNode.transform))){
            this.attack(player);
        }
        else{
            this.move(player);
        }
    }
    simpAnim(){
        //this.eNode.rotation[0]+=0.02
        this.eNode.updateTransform()
    }
    move(player){
        let eNode=this.eNode;
        //this.eNode.rotation[0]+=0.02
        let men=this.distGrid(mat4.getTranslation(player.translation, player.transform),mat4.getTranslation(this.eNode.translation, this.eNode.transform))
        let newMen=0
        this.eNode.translation[0]+=0.002
        this.eNode.updateTransform()
        newMen=this.distGrid(mat4.getTranslation(player.translation, player.transform),mat4.getTranslation(this.eNode.translation, this.eNode.transform))
        if(newMen>men){
            this.eNode.translation[0]-=0.002
            this.eNode.updateTransform()
        }
        else{
            return
        }
        
        this.eNode.translation[0]-=0.002
        this.eNode.updateTransform()
        newMen=this.distGrid(mat4.getTranslation(player.translation, player.transform),mat4.getTranslation(this.eNode.translation, this.eNode.transform))

        if(newMen>men){
            this.eNode.translation[0]+=0.002
            this.eNode.updateTransform()
        }
        else{
            return
        }

        this.eNode.translation[2]+=0.002
        this.eNode.updateTransform()
        newMen=this.distGrid(mat4.getTranslation(player.translation, player.transform),mat4.getTranslation(this.eNode.translation, this.eNode.transform))

        if(newMen>men){
            this.eNode.translation[2]-=0.002
            this.eNode.updateTransform()
            
        }
        else return
        

        this.eNode.translation[2]-=0.001
        this.eNode.updateTransform()
        newMen=this.distGrid(mat4.getTranslation(player.translation, player.transform),mat4.getTranslation(this.eNode.translation, this.eNode.transform))
        
        if(newMen>men){
            this.eNode.translation[2]+=0.001
            this.eNode.updateTransform()
        }
        else return 
        eNode.updateTransform()
    }

    attack(player){
        
        if(player.player && player.player.alive){
            let coinFlip = (Math.random());
            //console.log("a")
            if(coinFlip>0.97){
                //player.player.health-=this.dmg;
                player.player.death();
                if(!player.alive){
                   // location.replace("smrt.html")
                }
            }

        }
    }

    distToP(pPos,ePos){
        let Cx=pPos[0]-ePos[0];
        let Cz=pPos[2]-ePos[2];
        return Math.sqrt((Cx**2)+(Cz**2))<this.attackRadius+this.attackRadius;
    }

    distGrid(pPos,ePos){
        let Cx=pPos[0]-ePos[0];
        let Cz=pPos[2]-ePos[2];
        return Math.abs(Cx)+Math.abs(Cz);
    }
}

export class Player extends Enity{
    constructor(guns=[new Wepon("SHOTGUN",50),new Wepon("PISTOL",15),new Wepon("FISTS",10)],PNode){
        super()
        this.guns=guns;
        this.PNode=PNode;
        this.currGun = guns[0];
    }
}

export class Wepon{
    constructor(name,dmg=10){
        this.dmg=dmg;
        this.name = name;
    }
}