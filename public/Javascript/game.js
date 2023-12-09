import * as THREE from 'three';
import { GameObject } from './game-object.js';
import { FirstPersonCamera, KEYS } from './first-person-camera.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from "https://unpkg.com/three@0.157.0/examples/jsm/libs/stats.module.js";
import {RoundManager} from './round-manager.js';
import {Cloud} from "./cloud.js";
import { PlayerAudio } from './player-audio.js';

const gamePromise = new Promise((res, rej) =>{

import('./physics.js').then(info =>{
  info.physicsJsPromise.then(AmmoAndApp =>{
    const Ammo = AmmoAndApp[0];
    const APP = AmmoAndApp[1];
    const RigidBody = AmmoAndApp[2];

let stats;

const numThingsTOLoad = 2;
let numThingsLoaded = 0;
let gameLoaded = false;

const playerDead = new Event("PlayerDead");

function OnEverythingLoaded(){
  gameLoaded = true;
      //add fps counter
      stats = new Stats();
      document.body.appendChild(stats.dom);

      let overlayTextElements = document.getElementsByClassName("gameUi");
      overlayTextElements[0].style["display"] = "block";

      let loadingScreenDiv = document.getElementsByClassName("loadingScreen");
      loadingScreenDiv[0].style["display"] = "none";
}

function CheckEverythingsLoaded(){
  //if not everything has been loaded yet then return
  if (numThingsLoaded >= numThingsTOLoad){
    OnEverythingLoaded();
  }
}

class Game {
  constructor() {
    this.scene;
    /*lol*/
    this.camera;
    this.renderer;
    this.gameObjects = [];
    this.player;
    this.enemy;
    this.players = new Map();
    this.fpsCamera;
    this.clock = new THREE.Clock();
    this.gltfLoader = new GLTFLoader();
    //an array of socket id's each id being a client connected to the server
    this.connectionArray =[];
    //this clients socket id
    this.clientId;

    this.roundManager;
  };
  OnWindowResize(game) {
    //making window responsive
    game.camera.aspect = window.innerWidth / window.innerHeight;

    game.camera.updateProjectionMatrix();

    game.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  //init initialises and sets up the game
  Init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.camera.position.z = 5;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    //register resize event
    window.addEventListener('resize', () => {
      this.OnWindowResize(this);
    });

    //add pointMaterials for lesson
    const radius = 7;
    const widthSegments = 12;
    const heightSegments = 8;
    const geometry = new THREE.SphereGeometry(radius, widthSegments,heightSegments);
    const material = new THREE.PointsMaterial({
      color: 'red',
      size: 0.2
    });
    const points = new THREE.Points(geometry, material);
    this.scene.add(points);

    //================Physics init stuff==================
    //this code spawns a three js box where the physics world box exists, uncomment the scene.add line to see it in the scene
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(9, 1, 40),
      new THREE.MeshStandardMaterial({color: 0x808080})
    );
    ground.position.y = -2;
    // this.scene.add(ground);

    const rbGround = new RigidBody();
    rbGround.CreateBox(0, ground.position, ground.quaternion, new THREE.Vector3(100, 2, 100));
    rbGround.setRestitution(0.99);
    APP.physicsWorld.addRigidBody(rbGround.body);


    const box = new THREE.Mesh(
      new THREE.BoxGeometry(4,4,4),
      new THREE.MeshStandardMaterial({color: 0x808080})
    );
    box.position.set(0, 100, 0);
    this.scene.add(box);

    const rbBox = new RigidBody();
    rbBox.CreateBox(1, box.position, box.quaternion, new THREE.Vector3(4,4,4));
    rbBox.setRestitution(0.25);
    rbBox.setFriction(1);
    rbBox.setRollingFriction(5);
    APP.physicsWorld.addRigidBody(rbBox.body);

    const capsule = new THREE.Mesh(
      new THREE.CapsuleGeometry(1, 1, 4, 8),
      new THREE.MeshStandardMaterial({color: 0x808080})
    );
    capsule.position.set(0, 5, 0);
    this.scene.add(capsule);

    const rbCapsule = new RigidBody();
    rbCapsule.CreateCapsule(1, capsule.position, capsule.quaternion, 1, 1);
    rbCapsule.setRestitution(0.25);
    rbCapsule.setFriction(1);
    rbCapsule.setRollingFriction(5);
    APP.physicsWorld.addRigidBody(rbBox.body);

    this.rigidBodies = [{mesh: box, rigidBody: rbBox}, {mesh: capsule, rigidBody: rbCapsule}];

    this.tmpTransform = new Ammo.btTransform();


    //=================================================

    //add skybox
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('../GameAssets/Images/SkyboxTextures/CastleInMountains1.png', texture => {
      const skySphere = new THREE.SphereGeometry(100, 60, 40);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
      const skyBoxMesh = new THREE.Mesh(skySphere, material);
      this.scene.add(skyBoxMesh);
      numThingsLoaded ++;
      CheckEverythingsLoaded();
    });

    //load the medival bridge gltf into the scene
    let loadBridgePromise =  this.gltfLoader.loadAsync('../GameAssets/Models/Environment/MedivalBridgeLowPoly.glb');

    loadBridgePromise.then((gltf) =>{
      gltf.scene.position.y = -1.05;
      gltf.scene.scale.multiplyScalar(0.5);
      this.scene.add(gltf.scene);
      numThingsLoaded ++;
      setTimeout(CheckEverythingsLoaded, 500);
    });

    this.fpsCamera = new FirstPersonCamera(this.camera);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4), this.camera);

    let direcLight = new THREE.DirectionalLight(0xffffff, 1)
    direcLight.position.y = 2;
    direcLight.castShadow = true;

    this.scene.add(direcLight);

    this.gameObjects.forEach(element => {
      this.scene.add(element);
    });


    //spawn 10 clouds and randomly disperse them along the sky
    for (let i = 0; i < 10; i++){
      let cloudGroup = Cloud.CreateCloud();
      cloudGroup.position.x = Math.random() * 60 - 30;
      cloudGroup.position.y = Math.random() * 30 - 2.5;
      cloudGroup.position.z = Math.random() * 60 - 30;
      this.scene.add(cloudGroup);
    }

    document.getElementById("healButton").onclick = () =>{
      this.player.Heal(10);
    };
    document.getElementById("damageButton").onclick = () =>{
      let playerDead =this.player.Damage(10);
      if(playerDead){
        this.onClientDeath();
      }
    };

  }

  //update is called every animation frame
  Update() {
    let deltaTime = this.clock.getDelta();
    //update the fps cameras position
    this.fpsCamera.update(deltaTime);
    //if player isnt null then set their position and update the gltf position
    if (this.player) {
      this.player.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      this.player.updateGltfPosition();
    }
    if(gameLoaded){
      stats.update();
    }
    if(this.enemy){
      this.enemy.UpdateAnimMixer(deltaTime);
    }

    APP.physicsWorld.stepSimulation(deltaTime);

    for (let i = 0; i < this.rigidBodies.length; i++){
      this.rigidBodies[i].rigidBody.motionState.getWorldTransform(this.tmpTransform);
      const pos = this.tmpTransform.getOrigin();
      const quat = this.tmpTransform.getRotation();
      const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
      const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w());

      this.rigidBodies[i].mesh.position.copy(pos3);
      this.rigidBodies[i].mesh.quaternion.copy(quat3);
    }

    this.Render();
  }

  Render() {
    this.renderer.render(this.scene, this.camera);
  }

  //this is how new players are created and added to the game. this includes the local player and any networked player
  //The function is called from the main.js script
  NewPlayer(id ,{
    color = 0xff0000,
    inputEnabled = false
  }) {
    //load the player model
    let playerLoadPromise = this.gltfLoader.loadAsync('../GameAssets/Models/Player/knight-man-additive-complete.glb').then(gltf =>{
      //once the model has loaded add it to the scene then create the new player
      this.scene.add(gltf.scene);
      let _newPlayer = new GameObject({
          gravityEnabled: true,
          position: {
            x: 0,
            y: -0.245,
            z: 5
          },
          color: color,
          inputEnabled: inputEnabled,
          socketId: id,
          gltfScene: gltf.scene,
          gltfFile: gltf
        });
        //update appropriate game variables
        if(inputEnabled){
          this.player = _newPlayer;
          //create the round manager
          this.roundManager = new RoundManager(this.clientId);
        }
        else{
          this.enemy = _newPlayer;
        }
        this.gameObjects.push(_newPlayer);
        this.players.set(id, _newPlayer);
        //console.log(this.players);
        this.scene.add(_newPlayer);
        this.roundManager.addKeyValToMap(id, 0);
        _newPlayer.add(new PlayerAudio(["AttackSound1.wav", "AttackSound2.wav", "AttackSound3.wav"],this.listener));
        return _newPlayer;
    });
    return playerLoadPromise;
  };

  RemovePlayer(id) {

    let _player = this.players.get(id);
    this.scene.remove(_player);
    this.players.remove(id);
  }

  //this sets the positions of a networked player (the enemy player)
  UpdateNetworkedPlayer(id, position){
    try{
      this.players.get(id).position.set(position.x, position.y, position.z);
      this.players.get(id).updateGltfPosition();

    }
    catch{

    }
  }

  onClientDeath(){
    document.dispatchEvent(playerDead);
    setTimeout(()=>{
      this.roundManager.playerDead(this.clientId);
      this.player.ResetToIdleAnim();
    }, 5000)
  };
}

res(Game);
return Game;
})
});
});

export { gamePromise };
