import * as THREE from 'three';
import { GameObject } from './GameObject.js';
import { FirstPersonCamera, KEYS } from './FirstPersonCamera.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
  };
  OnWindowResize(game) {
    game.camera.aspect = window.innerWidth / window.innerHeight;

    game.camera.updateProjectionMatrix();

    game.renderer.setSize(window.innerWidth, window.innerHeight);
  }
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

    window.addEventListener('resize', () => {
      this.OnWindowResize(this);
    });


    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/GameAssets/SkyboxTextures/LowPolyTownSkybox.jpg', texture => {
      const skySphere = new THREE.SphereGeometry(100, 60, 40);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
      const skyBoxMesh = new THREE.Mesh(skySphere, material);
      this.scene.add(skyBoxMesh);
    });

    this.gltfLoader.load('./GameAssets/Models/Player/KnightMan.glb', (gltf) => {
      this.scene.add(gltf.scene);
    });
    //

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
      },
      color: "#808080",
      Geometry: new THREE.BoxGeometry(50, 0.5, 50),
      Material: new THREE.MeshStandardMaterial({color: 0x808080})
    }));

    this.gameObjects.forEach(element => {
      this.scene.add(element);
    });

  }

  Update() {
    if (this.player) {
      this.player.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    }
    this.fpsCamera.update(this.clock.getDelta());
    this.Render();
  }

  Render() {
    this.renderer.render(this.scene, this.camera);
  }

  NewPlayer(id ,{
    color = 0xff0000,
    inputEnabled = false
  }) {
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
      });
      if(inputEnabled){
        this.player = _newPlayer;
      }
      this.gameObjects.push(_newPlayer);
      this.players.set(id, _newPlayer);
      console.log(this.players);
      this.scene.add(_newPlayer);
  };

  RemovePlayer(id) {

    let _player = this.players.get(id);
    this.scene.remove(_player);
    this.players.remove(id);
  }

  UpdateNetworkedPlayer(id, position){
    this.players.get(id).position.set(position.x, position.y, position.z);
  }
}

export { Game };