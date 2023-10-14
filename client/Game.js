import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import {GameObject} from '/GameObject.js';

class Game{
    constructor(){
        this.scene;
        this.camera;
        this.renderer;
        this.gameObjects = [];
        this.player;
        this.players = [];
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
    //     this.gameObjects.push(new GameObject({
    //         gravityEnabled: true,
    //         position: {
    //             x: 0,
    //             y: 4,
    //             z: 0
    //         },
    //         color: 0x00ff00,
    //         inputEnabled: true,
    //     }));

    //     //setup input
    //     {
    //         let target = this.gameObjects[0];
    //     this.gameObjects[0].SetupInput({
    //         keyUp:{
    //             forwards: () =>{
    //                 target.velocity.z = 0;
    //             },
    //             backwards: () =>{
    //                 target.velocity.z = 0;
    //             },
    //             left: () =>{
    //                 target.velocity.x = 0;
    //             },
    //             right: ()=>{
    //                 target.velocity.x = 0;
    //             }
    //         },
    //         keyDown:{
    //             forwards: () =>{
    //                 target.velocity.z = -0.03;
    //             },
    //             backwards: () =>{
    //                 target.velocity.z = 0.03;
    //             },
    //             left: () =>{
    //                 target.velocity.x = -0.03;
    //             },
    //             right: ()=>{
    //                 target.velocity.x = 0.03;
    //             }
    //         }
    //     });
    // }

    // this.player = this.gameObjects[0];

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

    NewLocalPlayer(id){
        let localPlayer = new GameObject({
            gravityEnabled: true,
            position: {
                x: 0,
                y: 4,
                z: 0
            },
            color: 0x00ff00,
            inputEnabled: true,
            socketId: id
        });

        this.gameObjects.push(localPlayer);

        //setup input
        {
            let target = localPlayer;
        localPlayer.SetupInput({
            keyUp:{
                forwards: () =>{
                    target.velocity.z = 0;
                },
                backwards: () =>{
                    target.velocity.z = 0;
                },
                left: () =>{
                    target.velocity.x = 0;
                },
                right: ()=>{
                    target.velocity.x = 0;
                }
            },
            keyDown:{
                forwards: () =>{
                    target.velocity.z = -0.03;
                },
                backwards: () =>{
                    target.velocity.z = 0.03;
                },
                left: () =>{
                    target.velocity.x = -0.03;
                },
                right: ()=>{
                    target.velocity.x = 0.03;
                }
            }
        });
    }

    this.player = localPlayer;

    this.scene.add(localPlayer);

    }

    Update(socket){
        this.gameObjects.forEach(element => {
            element.Update();
        });

        socket.emit("playerUpdatePosition", {pos: this.player.position, id: this.player.socketId});

        this.Render();
    }

    Render(){
        this.renderer.render(this.scene, this.camera);
    }

    NewPlayer(id){
        console.log("New Player");
        this.gameObjects.push(new GameObject({
            gravityEnabled: true,
            position: {
                x: 2,
                y: 4,
                z: 0
            },
            color: 0x00ff00,
            inputEnabled: false,
            socketId: id
        }));

        this.players.push(this.gameObjects[this.gameObjects.length - 1]);
        this.scene.add(this.players[this.players.length - 1]);
        return this.players[this.players.length - 1]
    };

    RemovePlayer(id){
        this.players.forEach(player =>{
            if (player.socketId == id){
                this.scene.remove(player);
            }
            if (player.socketId == -1){
                this.scene.remove(player);
            }
        })
    }

    UpdateNetworkedObjectPos(data){
        console.log(data.id);
        let playerFound = false;
        let _player;
        this.players.forEach(player => {
            if(player.socketId == data.id){
                playerFound = true;
                _player = player;
            }
        });

        if (playerFound == true){
            _player.position.x = data.pos.x;
            _player.position.y = data.pos.y;
            _player.position.z = data.pos.z;
        }
        else{
            _player = this.NewPlayer(data.id);
            _player.position.x = data.pos.x;
            _player.position.y = data.pos.y;
            _player.position.z = data.pos.z;
        }
    }
}

export {Game};