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
            antialias: true
        });
        this.camera.position.z = -5;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.add(new THREE.AmbientLight(0xffffff, 10));

        let direcLight = new THREE.DirectionalLight(0xffffff, 1)

        this.scene.add(direcLight, new THREE.DirectionalLightHelper(direcLight));

        console.log(this.scene);
    }
    Render(){
        this.renderer.render(this.scene, this.camera);
    }
}

export {Game};