// //import * as THREE from 'three';
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js";
import { GameObject } from "./game-object.js";
import { FirstPersonCamera, KEYS } from "./first-person-camera.js";
import { GLTFLoader } from "./GLTFLoader.js";
import Stats from "https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/libs/stats.module.js";
import { RoundManager } from "./round-manager.js";
import { Cloud } from "./cloud.js";
import { PlayerAudio } from "./player-audio.js";
import serverAddress from "./serverAddress.js";

let joyStickData = {
  cardinalDirection: "C",
  x: 0,
  xPosition: 100,
  y: 0,
  yPosition: 100,
};
let prevJoyStickData = {
  cardinalDirection: "C",
  x: 0,
  xPosition: 100,
  y: 0,
  yPosition: 100,
};

const FLAGS = {CF_KINEMATIC_OBJECT: 2};

const gamePromise = new Promise((res, rej) => {
  import("./physics.js").then((info) => {
    info.physicsJsPromise.then((AmmoAndApp) => {
      const Ammo = AmmoAndApp[0];
      const APP = AmmoAndApp[1];
      const RigidBody = AmmoAndApp[2];
      const STATE = { DISABLE_DEACTIVATION: 4 };
      let stats;
      const numThingsTOLoad = 2;
      let numThingsLoaded = 0;
      let gameLoaded = false;
      const playerDead = new Event("PlayerDead");
      function OnEverythingLoaded() {
        gameLoaded = true;
        //add fps counter
        stats = new Stats();
        document.body.appendChild(stats.dom);
        let overlayTextElements = document.getElementsByClassName("gameUi");
        overlayTextElements[0].style["display"] = "block";
        let loadingScreenDiv = document.getElementsByClassName("loadingScreen");
        loadingScreenDiv[0].style["display"] = "none";
        if ("ontouchstart" in document.documentElement) {
          var joy1 = new JoyStick("joy1Div", {}, function (stickData) {
            prevJoyStickData = {
              cardinalDirection: joyStickData.cardinalDirection,
              x: joyStickData.x,
              xPosition: joyStickData.xPosition,
              y: joyStickData.y,
              yPosition: joyStickData.yPosition,
            };
            joyStickData = {
              cardinalDirection: stickData.cardinalDirection,
              x: stickData.x,
              xPosition: stickData.xPosition,
              y: stickData.y,
              yPosition: stickData.yPosition,
            };
          });
        }
      }
      function CheckEverythingsLoaded() {
        //if not everything has been loaded yet then return
        if (numThingsLoaded >= numThingsTOLoad) {
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
          this.connectionArray = [];
          //this clients socket id
          this.clientId;
          this.roundManager;
        }
        OnWindowResize(game) {
          //making window responsive
          game.camera.aspect = window.innerWidth / window.innerHeight;
          game.camera.updateProjectionMatrix();
          game.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        //init initialises and sets up the game
        Init() {
          this.scene = new THREE.Scene();
          this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
          );
          this.listener = new THREE.AudioListener();
          this.camera.add(this.listener);
          this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
          });
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = THREE.BasicShadowMap;
          this.camera.position.z = 5;
          this.renderer.shadowMap.enabled = true;
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          document.body.appendChild(this.renderer.domElement);
          function PlayRandomSong(audioListener) {
            fetch(serverAddress + "/randomSong").then((response) => {
              response.json().then((json) => {
                let song = json.song;
                let dataUrl = "data:audio/wav;base64," + song;
                const loader = new THREE.AudioLoader();
                loader.load(dataUrl, (buffer) => {
                  const sound = new THREE.Audio(audioListener);
                  sound.setBuffer(buffer);
                  const songOverEvent = new Event("OnSongOver");
                  setTimeout(
                    () => {
                      document.dispatchEvent(songOverEvent);
                    },
                    sound.buffer.duration * 1000 - 2000,
                  );
                  sound.setVolume(0.6);
                  sound.play();
                });
              });
            });
          }
          PlayRandomSong(this.listener);
          document.addEventListener(
            "OnSongOver",
            function () {
              PlayRandomSong(this.listener);
            }.bind(this),
          );
          //register resize event
          window.addEventListener("resize", () => {
            this.OnWindowResize(this);
          });
          //add pointMaterials for lesson
          const radius = 7;
          const widthSegments = 12;
          const heightSegments = 8;
          const geometry = new THREE.SphereGeometry(
            radius,
            widthSegments,
            heightSegments,
          );
          const material = new THREE.PointsMaterial({
            color: "red",
            size: 0.2,
          });
          const points = new THREE.Points(geometry, material);
          this.scene.add(points);

          //================Physics init stuff==================
          //this code spawns a three js box where the physics world box exists, uncomment the scene.add line to see it in the scene
          const ground = new THREE.Mesh(
            new THREE.BoxGeometry(15, 1, 40),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          ground.position.y = -2;
          // this.scene.add(ground);
          const rbGround = new RigidBody();
          rbGround.CreateBox(
            0,
            ground.position,
            ground.quaternion,
            new THREE.Vector3(100, 2, 100),
          );
          rbGround.setRestitution(0.99);
          APP.physicsWorld.addRigidBody(rbGround.body);
          //----------setup wall collisions
          const WALLFRICTION = 0.4;
          const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 40),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          leftWall.position.set(-5.8, 0, 0);
          // this.scene.add(leftWall);
          const rbLeftWall = new RigidBody();
          rbLeftWall.CreateBox(
            0,
            leftWall.position,
            leftWall.quaternion,
            new THREE.Vector3(4, 4, 40),
          );
          rbLeftWall.setRestitution(0.25);
          rbLeftWall.setFriction(WALLFRICTION);
          rbLeftWall.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbLeftWall.body);
          const rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 40),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          rightWall.position.set(5.8, 0, 0);
          // this.scene.add(rightWall);
          const rbRightWall = new RigidBody();
          rbRightWall.CreateBox(
            0,
            rightWall.position,
            rightWall.quaternion,
            new THREE.Vector3(4, 4, 40),
          );
          rbRightWall.setRestitution(0.25);
          rbRightWall.setFriction(WALLFRICTION);
          rbRightWall.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbRightWall.body);
          const backWall_left = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 4, 10),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          backWall_left.position.set(-2.4, 0, -22.5);
          // this.scene.add(backWall_left);
          const rbBackWall_left = new RigidBody();
          rbBackWall_left.CreateBox(
            0,
            backWall_left.position,
            backWall_left.quaternion,
            new THREE.Vector3(2.8, 4, 10),
          );
          rbBackWall_left.setRestitution(0.25);
          rbBackWall_left.setFriction(WALLFRICTION);
          rbBackWall_left.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbBackWall_left.body);
          const backWall_right = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 4, 10),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          backWall_right.position.set(2.6, 0, -22.5);
          // this.scene.add(backWall_right);
          const rbBackWall_right = new RigidBody();
          rbBackWall_right.CreateBox(
            0,
            backWall_right.position,
            backWall_right.quaternion,
            new THREE.Vector3(2.8, 4, 10),
          );
          rbBackWall_right.setRestitution(0.25);
          rbBackWall_right.setFriction(WALLFRICTION);
          rbBackWall_right.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbBackWall_right.body);
          const backWall_back = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 4, 10),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          backWall_back.position.set(0, 0, -25.5);
          // this.scene.add(backWall_back);
          const rbBackWall_back = new RigidBody();
          rbBackWall_back.CreateBox(
            0,
            backWall_back.position,
            backWall_back.quaternion,
            new THREE.Vector3(2.8, 4, 10),
          );
          rbBackWall_back.setRestitution(0.25);
          rbBackWall_back.setFriction(WALLFRICTION);
          rbBackWall_back.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbBackWall_back.body);
          const frontwall_center = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 4, 10),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          frontwall_center.position.set(0.25, 0, 24.1);
          // this.scene.add(frontwall_center);
          const rbfrontwall_center = new RigidBody();
          rbfrontwall_center.CreateBox(
            0,
            frontwall_center.position,
            frontwall_center.quaternion,
            new THREE.Vector3(2.6, 4, 10),
          );
          rbfrontwall_center.setRestitution(0.25);
          rbfrontwall_center.setFriction(WALLFRICTION);
          rbfrontwall_center.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbfrontwall_center.body);
          const frontwall_left = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 4, 10),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          frontwall_left.position.set(3.73, 0, 22.3);
          // this.scene.add(frontwall_left);
          const rbfrontwall_left = new RigidBody();
          rbfrontwall_left.CreateBox(
            0,
            frontwall_left.position,
            frontwall_left.quaternion,
            new THREE.Vector3(2.6, 4, 10),
          );
          rbfrontwall_left.setRestitution(0.25);
          rbfrontwall_left.setFriction(WALLFRICTION);
          rbfrontwall_left.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbfrontwall_left.body);
          const frontwall_right = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 4, 10),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          frontwall_right.position.set(-3.3, 0, 22.3);
          // this.scene.add(frontwall_right);
          const rbfrontwall_right = new RigidBody();
          rbfrontwall_right.CreateBox(
            0,
            frontwall_right.position,
            frontwall_right.quaternion,
            new THREE.Vector3(2.6, 4, 10),
          );
          rbfrontwall_right.setRestitution(0.25);
          rbfrontwall_right.setFriction(WALLFRICTION);
          rbfrontwall_right.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbfrontwall_right.body);
          const frontwallPillar_left = new THREE.Mesh(
            new THREE.CapsuleGeometry(1, 5, 4, 16),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          frontwallPillar_left.position.set(-2.3, 0, 19.5);
          // this.scene.add(frontwallPillar_left);
          const rbfrontwallPillar_left = new RigidBody();
          rbfrontwallPillar_left.CreateCapsule(
            0,
            frontwallPillar_left.position,
            frontwallPillar_left.quaternion,
            1,
            5,
          );
          rbfrontwallPillar_left.setRestitution(0.25);
          rbfrontwallPillar_left.setFriction(WALLFRICTION);
          rbfrontwallPillar_left.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbfrontwallPillar_left.body);
          const frontwallPillar_right = new THREE.Mesh(
            new THREE.CapsuleGeometry(1, 5, 4, 16),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          frontwallPillar_right.position.set(2.5, 0, 19.4);
          // this.scene.add(frontwallPillar_right);
          const rbfrontwallPillar_right = new RigidBody();
          rbfrontwallPillar_right.CreateCapsule(
            0,
            frontwallPillar_right.position,
            frontwallPillar_right.quaternion,
            1,
            5,
          );
          rbfrontwallPillar_right.setRestitution(0.25);
          rbfrontwallPillar_right.setFriction(WALLFRICTION);
          rbfrontwallPillar_right.setRollingFriction(5);
          APP.physicsWorld.addRigidBody(rbfrontwallPillar_right.body);
          const capsule = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.4, 0.8, 4, 16),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          capsule.position.set(0, 5, 0);
          // this.scene.add(capsule);
          //----------setup wall collisions
          const rbCapsule = new RigidBody();
          rbCapsule.CreateCapsule(
            1,
            capsule.position,
            capsule.quaternion,
            0.4,
            0.8,
          );
          rbCapsule.setRestitution(0.25);
          rbCapsule.setFriction(1);
          rbCapsule.setRollingFriction(5);
          rbCapsule.body.setActivationState(STATE.DISABLE_DEACTIVATION);
          rbCapsule.body.setAngularFactor(new Ammo.btVector3(0, 1, 0));
          APP.physicsWorld.addRigidBody(rbCapsule.body);
          
          
          //add kinematic rb for the enemy player collision

          const enemyCapsule = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.4, 0.8, 4, 16),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          //this.scene.add(enemyCapsule);
          this.enemyRb = new RigidBody();
          this.enemyRb.CreateKinematicCapsule(1,
            enemyCapsule.position,
            enemyCapsule.quaternion,
            0.4,
            0.8,)
            this.enemyRb.body.setActivationState(STATE.DISABLE_DEACTIVATION);
            this.enemyRb.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
            APP.physicsWorld.addRigidBody(this.enemyRb.body);



            this.rigidBodies = [{ mesh: capsule, rigidBody: rbCapsule }];
            this.tmpTransform = new Ammo.btTransform();
          //=================================================
          //add skybox
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(
            "../GameAssets/Images/SkyboxTextures/CastleInMountains1.png",
            (texture) => {
              const skySphere = new THREE.SphereGeometry(100, 60, 40);
              const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
              });
              const skyBoxMesh = new THREE.Mesh(skySphere, material);
              this.scene.add(skyBoxMesh);
              numThingsLoaded++;
              CheckEverythingsLoaded();
            },
          );
          //load the medival bridge gltf into the scene
          let loadBridgePromise = this.gltfLoader.loadAsync(
            "../GameAssets/Models/Environment/MedivalBridgeLowPoly.glb",
          );
          loadBridgePromise.then((gltf) => {
            gltf.recieveShadow = true;
            gltf.scene.position.y = -1.05;
            gltf.scene.scale.multiplyScalar(0.5);
            gltf.scene.traverse(function (node){
              if (node.isMesh){node.castShadow = true; node.recieveShadow = true}
            })
            this.scene.add(gltf.scene);
            numThingsLoaded++;
            setTimeout(CheckEverythingsLoaded, 500);
          });
          this.fpsCamera = new FirstPersonCamera(
            this.camera,
            rbCapsule,
            Ammo,
            joyStickData,
          );
          this.scene.add(new THREE.AmbientLight(0xffffff, 0.4), this.camera);
          let direcLight = new THREE.DirectionalLight(0xffffff, 1);
          direcLight.position.y = 2;
          direcLight.castShadow = true;
          direcLight.shadow.mapSize.width = 512;  
          direcLight.shadow.mapSize.height = 512; 
          direcLight.shadow.camera.near = 0.1;
          direcLight.shadow.camera.far = 500.0;
          direcLight.shadow.camera.left = -15;
          direcLight.shadow.camera.right = 15;
          direcLight.shadow.camera.top = 40;
          direcLight.shadow.camera.bottom = -40;
          this.scene.add(direcLight);
          this.gameObjects.forEach((element) => {
            this.scene.add(element);
          });
          //spawn 10 clouds and randomly disperse them along the sky
          for (let i = 0; i < 10; i++) {
            let cloudGroup = Cloud.CreateCloud();
            cloudGroup.position.x = Math.random() * 60 - 30;
            cloudGroup.position.y = Math.random() * 30 - 2.5;
            cloudGroup.position.z = Math.random() * 60 - 30;
            this.scene.add(cloudGroup);
          }
          document.getElementById("healButton").onclick = () => {
            this.player.Heal(10);
          };
          document.getElementById("damageButton").onclick = () => {
            let playerDead = this.player.Damage(10);
            if (playerDead) {
              this.onClientDeath();
            }
          };
        }
        //update is called every animation frame
        Update() {
          let deltaTime = this.clock.getDelta();
          if (
            prevJoyStickData.x != joyStickData.x ||
            prevJoyStickData.y != joyStickData.y
          ) {
            //console.log(joyStickData);
            prevJoyStickData = {
              cardinalDirection: joyStickData.cardinalDirection,
              x: joyStickData.x,
              xPosition: joyStickData.xPosition,
              y: joyStickData.y,
              yPosition: joyStickData.yPosition,
            };
          }
          this.fpsCamera.movementJoystick = joyStickData;
          //update the fps cameras position
          this.fpsCamera.update(deltaTime);
          //if player isnt null then set their position and update the gltf position
          if (this.player) {
            this.player.position.set(
              this.camera.position.x,
              this.camera.position.y,
              this.camera.position.z,
            );
            this.player.updateGltfPosition();
            //update player kinematic body
          }
          if (gameLoaded) {
            stats.update();
          }
          if (this.enemy) {
            //credits for how to move a kinematic rb https://medium.com/@bluemagnificent/moving-objects-in-javascript-3d-physics-using-ammo-js-and-three-js-6e39eff6d9e5
            this.enemy.UpdateAnimMixer(deltaTime);
            const enemyPos = this.enemy.GetPosition();
            let tempTrans = new Ammo.btTransform();
            tempTrans.setIdentity();
            tempTrans.setOrigin(new Ammo.btVector3(enemyPos.x,enemyPos.y,enemyPos.z));
            this.enemyRb.motionState.setWorldTransform(tempTrans);
          }
          APP.physicsWorld.stepSimulation(deltaTime);
          for (let i = 0; i < this.rigidBodies.length; i++) {
            this.rigidBodies[i].rigidBody.motionState.getWorldTransform(
              this.tmpTransform,
            );
            const pos = this.tmpTransform.getOrigin();
            const quat = this.tmpTransform.getRotation();
            const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
            const quat3 = new THREE.Quaternion(
              quat.x(),
              quat.y(),
              quat.z(),
              quat.w(),
            );
            try{
              this.rigidBodies[i].mesh.position.copy(pos3);
              this.rigidBodies[i].mesh.quaternion.copy(quat3);
            }
            catch{};
          }
          this.Render();
        }
        Render() {
          this.renderer.render(this.scene, this.camera);
        }
        //this is how new players are created and added to the game. this includes the local player and any networked player
        //The function is called from the main.js script
        NewPlayer(id, { color = 0xff0000, inputEnabled = false }) {
          //load the player model
          let playerLoadPromise = this.gltfLoader
            .loadAsync(
              "../GameAssets/Models/Player/knight-man-additive-complete.glb",
            )
            .then((gltf) => {
              gltf.castShadow = true;
              gltf.scene.traverse(function(node){
                if(node.isMesh){node.castShadow = true; node.recieveShadow = true};
              })
              //once the model has loaded add it to the scene then create the new player
              this.scene.add(gltf.scene);
              let _newPlayer = new GameObject({
                gravityEnabled: true,
                position: {
                  x: 0,
                  y: -0.245,
                  z: 5,
                },
                color: color,
                inputEnabled: inputEnabled,
                socketId: id,
                gltfScene: gltf.scene,
                gltfFile: gltf,
              });
              //update appropriate game variables
              if (inputEnabled) {
                this.player = _newPlayer;
                //create the round manager
                this.roundManager = new RoundManager(this.clientId);
              } else {
                this.enemy = _newPlayer;
              }
              this.gameObjects.push(_newPlayer);
              this.players.set(id, _newPlayer);
              //console.log(this.players);
              this.scene.add(_newPlayer);
              this.roundManager.addKeyValToMap(id, 0);
              _newPlayer.add(
                new PlayerAudio(
                  ["AttackSound1.wav", "AttackSound2.wav", "AttackSound3.wav"],
                  this.listener,
                ),
              );
              return _newPlayer;
            });
          return playerLoadPromise;
        }
        RemovePlayer(id) {
          let _player = this.players.get(id);
          this.scene.remove(_player);
          this.players.remove(id);
        }
        //this sets the positions of a networked player (the enemy player)
        UpdateNetworkedPlayer(id, position) {
          try {
            this.players
              .get(id)
              .position.set(position.x, position.y, position.z);
            this.players.get(id).updateGltfPosition();
          } catch {}
        }
        onClientDeath() {
          document.dispatchEvent(playerDead);
          setTimeout(() => {
            this.roundManager.playerDead(this.clientId);
            // this.player.ResetToIdleAnim();
          }, 5000);
        }
      }
      res(Game);
      return Game;
    });
  });
});

export { gamePromise };
