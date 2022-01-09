export class eventManeger{
    constructor(camera,currNumofT=100){
        this.enemy = [];
        this.bullets=[];
        this.player=camera;
        this.currNumofT=currNumofT;
        this.spawnPoints=[[11.827005392424763, 1, 7.405017679003413],[-0.21947771345546865, 1, 18.225894927824587],[9.73705005645753, 1, 4.066187381744383],[-5.435450443289451, 1, 2.0657998525644214],[-5.595996379852295, 1, -0.20111192762851715]];
    }

    EnemyDecison(){
        for(let enemy in this.enemy){
            if(this.enemy[enemy].enity.alive) {
                this.enemy[enemy].enity.action(this.player);
                this.enemy[enemy].enity.simpAnim();
            }
            else removeEnemy(enemy);
        }
    }

    removeEnemy(index){
        this.enemy.splice(index,1);
    }
}