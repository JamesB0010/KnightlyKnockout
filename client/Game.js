import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import {GameObject} from '/GameObject.js';

//fps camera controls from https://www.youtube.com/watch?v=oqKzxPMLWxo
import {FirstPersonCamera, KEYS} from './FirstPersonCamera';

import {GLTFLoader} from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

class Game{
    constructor(){
        this.scene;
        this.camera;
        this.renderer;
        this.gameObjects = [];
        this.player;
        this.players = new Map();
        this.fpsCamera;
        this.clock = new THREE.Clock();
        this.gltfLoader = new GLTFLoader();
        this.prevReqAnimFrame = null;
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

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('./Assets/LowPolyTownSkyBox.jpg', texture =>{
            const skySphere = new THREE.SphereGeometry(100, 60, 40);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            })
            this.scene.add(new THREE.Mesh(skySphere, material));
        });

        //this.gltfLoader.load();

        this.fpsCamera = new FirstPersonCamera(this.camera);

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.4), this.camera);

        let direcLight = new THREE.DirectionalLight(0xffffff, 1)
        direcLight.position.y = 2;
        direcLight.castShadow = true;

        this.scene.add(direcLight, new THREE.DirectionalLightHelper(direcLight));

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

        document.body.appendChild(this.renderer.domElement);
    
    }

    NewLocalPlayer(id){
        console.log("new local player");
        let localPlayer = new GameObject({
            position: {
                x: 0,
                y: 4,
                z: 0
            },
            color: 0x00ff00,
            inputEnabled: true,
            socketId: id,
        });

    this.player = localPlayer;

    this.scene.add(localPlayer);

    }

    Update(socket, t){
        if(this.prevReqAnimFrame === null){
            this.prevReqAnimFrame = t;
        }

        const timeElapsedS = (t - this.prevReqAnimFrame) * 0.001;


        this.gameObjects.forEach(element => {
            element.Update();
        });

        if(this.player){
            this.player.Update();
            this.player.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        }

        if(this.player){

            socket.emit("playerUpdatePosition", {pos: this.player.position, id: this.player.socketId});
        }

        //this.fpsCamera.update(timeElapsedS);
        this.fpsCamera.update(this.clock.getDelta());
        this.Render();
    }

    Render(){
        this.renderer.render(this.scene, this.camera);
    }

    NewPlayer({
        id,
        color = 0xff0000
    }){
        console.log("New Player");
        let _newPlayer = new GameObject({
            gravityEnabled: true,
            position: {
                x: 2,
                y: 4,
                z: 0
            },
            color: color,
            inputEnabled: false,
            socketId: id
        });

        this.gameObjects.push(_newPlayer);
        this.players.set(id, _newPlayer);
        this.scene.add(_newPlayer);
        return _newPlayer;
    };

    RemovePlayer(id){

        let _player = this.players.get(id);
        this.scene.remove(_player);
    }

    UpdateNetworkedObjectPos(data){

        let _player = this.players.get(data.id);

        if(_player){
            _player.position.x = data.pos.x;
            _player.position.y = data.pos.y;
            _player.position.z = data.pos.z;
        }
        else{
            _player = this.NewPlayer({
                id: data.id,
            });
            _player.position.x = data.pos.x;
            _player.position.y = data.pos.y;
            _player.position.z = data.pos.z;
        }
    }
}

export {Game};