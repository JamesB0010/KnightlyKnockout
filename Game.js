import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import {GameObject} from '/GameObject.js';

class Game{
    constructor(){
        this.scene;
        this.camera;
        this.renderer;
        this.gameObjects = [];
    };
    Init(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.camera.position.z = 5;
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const controls =  new OrbitControls(this.camera, this.renderer.domElement);

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        let direcLight = new THREE.DirectionalLight(0xffffff, 1)
        direcLight.position.y = 2;
        direcLight.castShadow = true;

        this.scene.add(direcLight, new THREE.DirectionalLightHelper(direcLight));

        //add player
        this.gameObjects.push(new GameObject({}));

        //add floor
        this.gameObjects.push(new GameObject({
            height: 0.5,
            width: 50,
            depth: 50,
            position: {
                x: 0,
                y: -1,
                z: 0
            }
        }));

        this.gameObjects.forEach(element => {
            this.scene.add(element);
        });

    }
    Render(){
        this.renderer.render(this.scene, this.camera);
    }
}

export {Game};