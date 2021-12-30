import { GUI } from '../../lib/dat.gui.module.js';

import { Application } from '../../common/engine/Application.js';

import { Renderer } from './Renderer.js';
import { Physics } from './Physics.js';
import { Camera } from './Camera.js';
import { SceneLoader } from './SceneLoader.js';
import { SceneBuilder } from './SceneBuilder.js';
import { Model } from './Model.js';
import { Mesh } from './Mesh.js';
import { Light } from './Light.js';

class App extends Application {

    start() {
        const gl = this.gl;
        this.Light=new Light()
        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;

        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('scene.json');
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene(uri);
        const builder = new SceneBuilder(scene);
        this.scene = builder.build();
        /*Primer dodajanja engea objekta v scean za dodajanje v aktivno zgolj to prestavi v update*/
        const tMesh = scene.meshes[0]
        const tTexture = scene.textures[0]
        let model = new Model(tMesh, tTexture);
        //konec primera
        this.scene.addNode(model)
        this.physics = new Physics(this.scene);

        // Find first camera.
        this.camera = null;
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            }
        });

        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.renderer.prepare(this.scene);
    }

    enableCamera() {
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        if (!this.camera) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.camera.enable();
        } else {
            this.camera.disable();
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;

        if (this.camera) {
            this.camera.update(dt);
        }

        if (this.physics) {
            this.physics.update(dt);
        }
    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera, this.Light);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.camera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjection();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gamecanvas');
    const app = new App(canvas);
    const gui = new GUI();
    gui.add(app, 'enableCamera');
});

// LOCKED CAMERA   
let locked = false;
document.addEventListener("pointerlockchange", () => {
    const cvs = document.getElementById('gamecanvas');
    if (document.pointerLockElement === cvs) {
        locked = true;
    } else {
        locked = false;
    }
})

// BOSS MUSIC
let theme = new Audio("../common/sounds/08. First Day in Hell.mp3");
theme.currentTime = 0;
theme.volume = 0.25;
theme.play();

// WEAPON SOUNDS
let pistolfire = new Audio("../common/sounds/pistolfire.mp3");
pistolfire.volume = 0.5;
let pistolempty = new Audio("../common/sounds/pistolempty.mp3");
pistolempty.volume = 0.5;
let shotgunfire = new Audio("../common/sounds/shotgunfire.mp3");
shotgunfire.volume = 0.5;
let punch = new Audio("../common/sounds/punch.wav");
punch.volume = 0.5;
let reloadsound = new Audio("../common/sounds/reload.mp3");
reloadsound.volume = 0.5;
let switchsound = new Audio("../common/sounds/switch.mp3")
switchsound.volume = 1;
    
let lockReload = false;
let lockSwitch = false;

let shotgunammo = 8;
let pistolammo = 20;

// CHANGE WEAPONS
document.addEventListener('keydown', (event) => {
    if (locked && !lockSwitch) {
        setTimeout(function() {
            let name = event.key;
            switch (name) {
                case "1":
                    setTimeout(function() {
                        document.getElementById("weapondata").innerHTML = "SHOTGUN";
                        document.getElementById("ammodata").innerHTML = shotgunammo;
                        lockReload = false;
                        document.getElementById("pic").src="../common/images/shotgun.png";
                    }, 1000);
                        lockReload = true;
                        switchsound.currentTime = 0;
                        switchsound.play();
                    break;
                case "2":
                    setTimeout(function() {
                        document.getElementById("weapondata").innerHTML = "PISTOL";
                        document.getElementById("ammodata").innerHTML = pistolammo;
                        lockReload = false;
                        document.getElementById("pic").src="../common/images/pistol.png";
                    }, 1000);
                        lockReload = true;
                        switchsound.currentTime = 0;
                        switchsound.play();
                    break;
                case "3":
                    setTimeout(function() {
                        document.getElementById("weapondata").innerHTML = "FISTS";
                        document.getElementById("ammodata").innerHTML = "&#8734";
                        document.getElementById("pic").src="../common/images/fist.png";
                    }, 1000);
                        switchsound.currentTime = 0;
                        switchsound.play();
                    break;
            }
        }, 1000);
    }
});


// RELOAD WEAPONS
document,addEventListener('keydown', (event) => {
    if (locked && !lockReload) {
            let name = event.key;
            let weap = document.getElementById("weapondata").innerHTML;
            if (name == "r") {
                switch (weap) {
                    case "SHOTGUN":
                        setTimeout(function() {
                            shotgunammo = 8;
                            document.getElementById("ammodata").innerHTML = shotgunammo;
                            lockSwitch = false;
                        }, 1200);
                            reloadsound.currentTime = 0;
                            reloadsound.play();
                            lockSwitch = true;
                        break;
                    case "PISTOL":
                        setTimeout(function() {
                            pistolammo = 20;
                            document.getElementById("ammodata").innerHTML = pistolammo;
                            lockSwitch = false;
                        }, 700);
                            reloadsound.currentTime = 0;
                            reloadsound.play();
                            lockSwitch = true;
                        break;
                    case "FISTS":
                            setTimeout(function() {
                                lockSwitch = false;
                            }, 500);
                                lockSwitch = true;
                        break;
                }
            }
         
    }
})

// SHOOTING (ANIMATION), SOUND, AMMO COUNTER
document.addEventListener("click", () => { 
    if (locked && !lockSwitch && !lockReload) {
        let ammo;
        switch (document.getElementById("weapondata").innerHTML) {
            case "PISTOL":
                ammo = pistolammo - 1;
                pistolammo = pistolammo - 1;
                if (ammo >= 0) {
                    document.getElementById("ammodata").innerHTML = ammo;
                    // strel zvok in animacija
                    document.getElementById("pic").src="../common/images/pistol_shoot.png";
                    setTimeout(function() {
                        document.getElementById("pic").src="../common/images/pistol.png";
                    },100);
                    pistolfire.currentTime = 0;
                    pistolfire.play();
                } else {
                    // empty magazine sound
                    pistolempty.currentTime = 0;
                    pistolempty.play();
                }
                break;
            case "SHOTGUN":
                ammo = shotgunammo - 1;
                shotgunammo = shotgunammo - 1;
                if (ammo >= 0) {
                    document.getElementById("ammodata").innerHTML = ammo;
                    // strel zvok in animacija
                    document.getElementById("pic").src="../common/images/shotgun_shoot.png";
                    setTimeout(function() {
                        document.getElementById("pic").src="../common/images/shotgun.png";
                    },100);
                    shotgunfire.currentTime = 0;
                    shotgunfire.play();
                } else {
                    // empty magazine sound
                    pistolempty.currentTime = 0;
                    pistolempty.play();
                }
                break;
            case "FISTS":
                // udarec zvok in animacija
                document.getElementById("pic").src="../common/images/fist_shoot.png";
                    setTimeout(function() {
                        document.getElementById("pic").src="../common/images/fist.png";
                    },100);
                punch.currentTime = 0;
                punch.play();
                break;
        }
    }
})






