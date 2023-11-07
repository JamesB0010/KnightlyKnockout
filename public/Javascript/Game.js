import * as THREE from 'three';
import { GameObject } from './game-object.js';
import { FirstPersonCamera, KEYS } from './first-person-camera.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from "https://unpkg.com/three@0.157.0/examples/jsm/libs/stats.module.js";
import {RoundManager} from './round-manager.js';
import {Cloud} from "./cloud.js";

let stats;

const numThingsTOLoad = 2;
let numThingsLoaded = 0;
let gameLoaded = false;

function OnEverythingLoaded(){
  gameLoaded = true;
      //add fps counter
      stats = new Stats();
      document.body.appendChild(stats.dom);

      let overlayTextElements = document.getElementsByClassName("gameUi");
      overlayTextElements[0].style["display"] = "block";

      let loadingScreenDiv = document.getElementsByClassName("loadingScreen");
      loadingScreenDiv[0].style["display"] = "none";
  console.log("remove loading screen");
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
    this.camera;
    this.renderer;
    this.gameObjects = [];
    this.player;
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
    let loadBridgePromise =  this.gltfLoader.loadAsync('../GameAssets/Models/Environment/MedivalBridge.glb');

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

    this.scene.add(direcLight, new THREE.DirectionalLightHelper(direcLight));

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

    //create the round manager
    this.roundManager = new RoundManager();

  }

  //update is called every animation frame
  Update() {
    //update the fps cameras position
    this.fpsCamera.update(this.clock.getDelta());
    //if player isnt null then set their position and update the gltf position
    if (this.player) {
      this.player.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      this.player.updateGltfPosition();
    }
    this.Render();
    if(gameLoaded){
      stats.update();
    }
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
    this.gltfLoader.load('../GameAssets/Models/Player/KnightMan.glb', gltf =>{
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
          gltfScene: gltf.scene
        });
        //update appropriate game variables
        if(inputEnabled){
          this.player = _newPlayer;
        }
        this.gameObjects.push(_newPlayer);
        this.players.set(id, _newPlayer);
        console.log(this.players);
        this.scene.add(_newPlayer);
    })
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
    //this.roundManager.clientDead();
  };
}

export { Game };