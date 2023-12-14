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
import { Particle } from "./particle.js";

const swordCollisionEvent = new CustomEvent("OnSwordCollision");

const swordBlockEvent = new CustomEvent("OnSwordBlock");

let swordCollisionTimer = 2.0;
let isSwinging = false;

document.addEventListener("Attack", () => {
  isSwinging = true;
})

const CountdownSwordCollisionTimer = (dt) => {
  if (isSwinging) {
    swordCollisionTimer -= dt;
    if (swordCollisionTimer <= 0) {
      isSwinging = false;
      swordCollisionTimer = 2.0;
    }
  }
}

//setting up collision bit masks
let colGroupPlayer = 0b0001;
let colMaskPlayer = 0b0001;
let colGroupSword = 0b1000;
let colMaskSword = 0b1000;
let colGroupEnvironment = 0b0001;
let colMaskEnvironment = 0b0001;
let colGroupEnemy = 0b1001;
let colMaskEnemy = 0b1001;

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

const FLAGS = { CF_KINEMATIC_OBJECT: 2 };

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

          this.particles = [];
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
                  sound.setVolume(0.3);
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
          rbGround.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbGround.body, colGroupEnvironment, colMaskEnvironment);
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
          rbLeftWall.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbLeftWall.body, colGroupEnvironment, colMaskEnvironment);
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
          rbRightWall.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbRightWall.body, colGroupEnvironment, colMaskEnvironment);
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
          rbBackWall_left.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbBackWall_left.body, colGroupEnvironment, colMaskEnvironment);
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
          rbBackWall_right.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbBackWall_right.body, colGroupEnvironment, colMaskEnvironment);
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
          rbBackWall_back.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbBackWall_back.body, colGroupEnvironment, colMaskEnvironment);
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
          rbfrontwall_center.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbfrontwall_center.body, colGroupEnvironment, colMaskEnvironment);
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
          rbfrontwall_left.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbfrontwall_left.body, colGroupEnvironment, colMaskEnvironment);
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
          rbfrontwall_right.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbfrontwall_right.body, colGroupEnvironment, colMaskEnvironment);
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
          rbfrontwallPillar_left.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbfrontwallPillar_left.body, colGroupEnvironment, colMaskEnvironment);
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
          rbfrontwallPillar_right.body.isEnvironment = true;
          APP.physicsWorld.addRigidBody(rbfrontwallPillar_right.body, colGroupEnvironment, colMaskEnvironment);

          //add kinematic rb for the enemy player collision

          const enemyCapsule = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.4, 0.8, 4, 16),
            new THREE.MeshStandardMaterial({ color: 0x808080 }),
          );
          enemyCapsule.position.set(0, -30, 0);
          //this.scene.add(enemyCapsule);
          this.enemyRb = new RigidBody();
          this.enemyRb.CreateKinematicCapsule(1,
            enemyCapsule.position,
            enemyCapsule.quaternion,
            0.4,
            0.8,)
          this.enemyRb.body.setActivationState(STATE.DISABLE_DEACTIVATION);
          this.enemyRb.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
          this.enemyRb.body.isSword = false;
          this.enemyRb.body.isEnemy = true;
          this.enemyRb.body.isEnvironment = false;
          APP.physicsWorld.addRigidBody(this.enemyRb.body, colGroupEnemy, colMaskEnemy);

          this.playerSword = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.2, 0.6, 4, 16),
            new THREE.MeshStandardMaterial({ color: 0x0000ff })
          )
          this.playerSword.visible = false;
          this.scene.add(this.playerSword);

          this.rbPlayerSword = new RigidBody();
          this.rbPlayerSword.CreateKinematicCapsule(1, this.playerSword.position, this.playerSword.quaternion, 0.2, 0.6);
          this.rbPlayerSword.body.setActivationState(STATE.DISABLE_DEACTIVATION);
          this.rbPlayerSword.body.isSword = true;
          this.rbPlayerSword.body.isEnemy = false;
          this.rbPlayerSword.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
          this.rbPlayerSword.body.isEnvironment = false;
          APP.physicsWorld.addRigidBody(this.rbPlayerSword.body, colGroupSword, colMaskSword);




          this.rigidBodies = [];
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
            gltf.scene.traverse(function (node) {
              if (node.isMesh) { node.castShadow = true; node.recieveShadow = true }
            })
            this.scene.add(gltf.scene);
            numThingsLoaded++;
            setTimeout(CheckEverythingsLoaded, 500);
          });
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

        SwordCollided = () => {
          if (isSwinging) {
            if (this.enemy.GetIsBlocking() == false) {
              document.dispatchEvent(swordCollisionEvent);
              this.particles.push(new Particle(this.enemy.position));
              this.scene.add(this.particles[this.particles.length - 1].points);
            }
            else {
              document.dispatchEvent(swordBlockEvent);
              this.particles.push(new Particle(this.enemy.position, "yellow"));
              this.scene.add(this.particles[this.particles.length - 1].points);
            }
            isSwinging = false;
          }
        }

        //credit for tutorial on collision detection with ammo https://medium.com/@bluemagnificent/collision-detection-in-javascript-3d-physics-using-ammo-js-and-three-js-31a5569291ef
        DetectCollision() {

          let dispatcher = APP.physicsWorld.getDispatcher();
          let numManifolds = dispatcher.getNumManifolds();

          for (let i = 0; i < numManifolds; i++) {

            let contactManifold = dispatcher.getManifoldByIndexInternal(i);

            let rb0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
            let rb1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);


            if (rb0.isEnvironment || rb1.isEnvironment) continue;

            if (!rb0.isSword && !rb1.isSword) continue;

            this.SwordCollided();
            return;
          }

        }
        //update is called every animation frame
        Update() {
          let deltaTime = this.clock.getDelta();
          CountdownSwordCollisionTimer(deltaTime);
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
          try {
            this.fpsCamera.movementJoystick = joyStickData;
            //update the fps cameras position
            this.fpsCamera.update(deltaTime);
          }
          catch { };
          //if player isnt null then set their position and update the gltf position
          if (this.player) {
            this.player.position.set(
              this.camera.position.x,
              this.camera.position.y,
              this.camera.position.z,
            );
            this.player.UpdateAnimMixer(deltaTime);
            this.player.updateGltfPosition();

            let boneWorldPos = new THREE.Vector3();
            let boneWorldRot = new THREE.Quaternion();
            this.player.gltfScene.getObjectByName('mixamorigRightHand').getWorldPosition(boneWorldPos);
            this.player.gltfScene.getObjectByName('mixamorigRightHand').getWorldQuaternion(boneWorldRot);
            this.playerSword.position.set(boneWorldPos.x, boneWorldPos.y, boneWorldPos.z);
            this.playerSword.quaternion.set(boneWorldRot.x, boneWorldRot.y, boneWorldRot.z, boneWorldRot.w);
            this.playerSword.rotation.set(this.playerSword.rotation.x, this.playerSword.rotation.y, this.playerSword.rotation.z + Math.PI * 0.5);
            this.playerSword.translateY(-0.5);

            let tempTrans = new Ammo.btTransform();
            tempTrans.setIdentity();
            tempTrans.setOrigin(new Ammo.btVector3(this.playerSword.position.x, this.playerSword.position.y, this.playerSword.position.z));
            tempTrans.setRotation(new Ammo.btQuaternion(this.playerSword.quaternion.x, this.playerSword.quaternion.y, this.playerSword.quaternion.z, this.playerSword.quaternion.w));
            this.rbPlayerSword.motionState.setWorldTransform(tempTrans);
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
            tempTrans.setOrigin(new Ammo.btVector3(enemyPos.x, enemyPos.y, enemyPos.z));
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
            try {
              this.rigidBodies[i].mesh.position.copy(pos3);
              this.rigidBodies[i].mesh.quaternion.copy(quat3);
            }
            catch { };
          }

          this.DetectCollision();

          this.particles.forEach(particle => {
            let destroyParticle = particle.update(deltaTime);
            if (destroyParticle) {
              let ptcle = this.particles.shift();
              ptcle.points.position.set(0, -30, 0);
            }
          })

          this.Render();
        }

        ResetPlayerLocation() {
          //credits on how to move a dynamic rigidbody https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=6252
          let playerTrans = this.playerRbCapsule.body.getCenterOfMassTransform();
          playerTrans.setOrigin(new Ammo.btVector3(this.playerStartPosition.x, this.playerStartPosition.y, this.playerStartPosition.z));
          this.playerRbCapsule.setCenterOfMassTransform(playerTrans);
          document.dispatchEvent(new CustomEvent("OnClientMove"));
        }
        Render() {
          this.renderer.render(this.scene, this.camera);
        }
        //this is how new players are created and added to the game. this includes the local player and any networked player
        //The function is called from the main.js script
        NewPlayer(id, { color = 0xff0000, inputEnabled = false, playerIndex = 0, isClient = false }) {
          if (id == this.clientId) {
            const capsule = new THREE.Mesh(
              new THREE.CapsuleGeometry(0.4, 0.8, 4, 16),
              new THREE.MeshStandardMaterial({ color: 0x808080 }),
            );
            if (playerIndex == 0) {
              this.playerStartPosition = new THREE.Vector3(0,5,15);
              capsule.position.set(0, 5, 15);
            }
            else {
              this.playerStartPosition = new THREE.Vector3(0,5,-15);
              capsule.position.set(0, 5, -15);
            }
            // this.scene.add(capsule);
            //----------setup wall collisions
            this.playerRbCapsule = new RigidBody();
            this.playerRbCapsule.CreateCapsule(
              1,
              capsule.position,
              capsule.quaternion,
              0.4,
              0.8,
            );
            this.playerRbCapsule.setRestitution(0.25);
            this.playerRbCapsule.setFriction(1);
            this.playerRbCapsule.setRollingFriction(5);
            this.playerRbCapsule.body.setActivationState(STATE.DISABLE_DEACTIVATION);
            this.playerRbCapsule.body.setAngularFactor(new Ammo.btVector3(0, 1, 0));
            this.playerRbCapsule.body.isEnvironment = false;
            APP.physicsWorld.addRigidBody(this.playerRbCapsule.body, colGroupPlayer, colMaskPlayer);

            this.rigidBodies.push({ mesh: capsule, rigidBody: this.playerRbCapsule });

            this.fpsCamera = new FirstPersonCamera(
              this.camera,
              this.playerRbCapsule,
              Ammo,
              joyStickData,
            );
          }

          //load the player model
          let playerLoadPromise = this.gltfLoader
            .loadAsync(isClient ? "../GameAssets/Models/Player/knightAnimationsForKnightlyKnockoutAdditiveHeadless.glb" :
              "../GameAssets/Models/Player/knight-man-additive-complete.glb",
            )
            .then((gltf) => {
              gltf.castShadow = true;
              gltf.scene.traverse(function (node) {
                if (node.isMesh) { node.castShadow = true; node.recieveShadow = true };
              })
              //once the model has loaded add it to the scene then create the new player
              this.scene.add(gltf.scene);
              let _newPlayer = new GameObject({
                gravityEnabled: true,
                position: {
                  x: 0,
                  y: -20,
                  z: 0
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
                if (this.roundManager == undefined) {
                  //create the round manager
                  this.roundManager = new RoundManager(this.clientId);
                };
              } else {
                this.enemy = _newPlayer;
                if (this.roundManager == undefined) {
                  this.roundManager = new RoundManager(this.clientId);
                }
              }
              this.gameObjects.push(_newPlayer);
              this.players.set(id, _newPlayer);
              //console.log(this.players);
              this.scene.add(_newPlayer);
              //try {
              this.roundManager.addKeyValToMap(id, 0);
              //}
              // catch {
              //   alert("A Fatal error occured returning to landing page, please try again");
              //   setTimeout(() => {
              //     window.location.href = serverAddress;
              //   }, 3000);
              // }
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
          } catch { }
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
