import { Game } from '/game.js';
import * as THREE from 'three';


//reference for getting a hello world of ammo js where a cube falls from the sky https://www.youtube.com/watch?v=puDiCbrjIzc

class RigidBody{
  constructor(){
  };

  CreateBox(mass, pos, quat, size){
    this.transform = new Ammo.btTransform();
    this.transform.setIdentity();
    this.transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    this.transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    this.motionState = new Ammo.btDefaultMotionState(this.transform);

    const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    this.shape = new Ammo.btBoxShape(btSize);
    this.shape.setMargin(0.05);

    this.inertia = new Ammo.btVector3(0,0,0);
    if(mass > 0){
      this.shape.calculateLocalInertia(mass, this.inertia);
    }

    this.info = new Ammo.btRigidBodyConstructionInfo(
      mass, this.motionState, this.shape, this.inertia);

    this.body = new Ammo.btRigidBody(this.info);

    Ammo.destroy(btSize);
  }

  setRestitution(val){
    this.body.setRestitution(val);
  }

  setFriction(val){
    this.body.setFriction(val);
  }

  setRollingFriction(val){
    this.body.setRollingFriction(val);
  }
}

class PhysicsWorld{
  constructor(){
  }

  Initialise(){
    this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    this.dispacher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
    this.broadphase = new Ammo.btDbvtBroadphase();
    this.solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispacher, this.broadphase, this.solver, this.collisionConfiguration);
    this.physicsWorld.setGravity(new Ammo.btVector3(0,-100,0));
  }
}

let game = new Game();
game.Init();

let APP = null;

Ammo().then(lib => {
  Ammo = lib;
  APP = new PhysicsWorld();
  APP.Initialise();

  game.updateFunctions.push(deltaTime =>{
    APP.physicsWorld.stepSimulation(deltaTime);
  })
  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(100, 1, 100),
    new THREE.MeshStandardMaterial({color: 0x808080})
  );
  ground.position.y = -2;
  game.scene.add(ground);
  
  const rbGround = new RigidBody();
  rbGround.CreateBox(0, ground.position, ground.quaternion, new THREE.Vector3(100, 1, 100));
  rbGround.setRestitution(0.99);
  APP.physicsWorld.addRigidBody(rbGround.body);

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(4,4,4),
    new THREE.MeshStandardMaterial({color: 0x808080})
  );
  box.position.set(0, 100, 0);
  game.scene.add(box);

  const rbBox = new RigidBody();
  rbBox.CreateBox(1, box.position, box.quaternion, new THREE.Vector3(4,4,4));
  rbBox.setRestitution(0.25);
  rbBox.setFriction(1);
  rbBox.setRollingFriction(5);
  APP.physicsWorld.addRigidBody(rbBox.body);

  const rigidBodies = [{mesh: box, rigidBody: rbBox}];

  let tmpTransform = new Ammo.btTransform();

  game.updateFunctions.push(() =>{
    for (let i = 0; i < rigidBodies.length; i++){
      rigidBodies[i].rigidBody.motionState.getWorldTransform(tmpTransform);
      const pos = tmpTransform.getOrigin();
      const quat = tmpTransform.getRotation();
      const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
      const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w());

      rigidBodies[i].mesh.position.copy(pos3);
      rigidBodies[i].mesh.quaternion.copy(quat3);
    }
  })
})



  const socket = io(); // create new socket instance

  //add a game loading screen;

  //create a new game and initialise it

  let usernamesMap = new Map();
  let latestClient;


  //setup socket listeners
  //when a client joins the server a setId message will be sent to the client, they set their client id and connection array and make a new player
  socket.on("setId", id => {
    game.clientId = id;
    game.connectionArray.push(id);
    game.NewPlayer(id, { color: 0xffffff, inputEnabled: true });
    if (sessionStorage.username) {
      socket.emit("profileInfo", sessionStorage.username)
    }
  })

  //whenever a player joins the server send the cupdateConnectionsArr message to all clients 
  socket.on("updateConnectionsArr", (connections) => {
    if (connections.length == 1) {
      //only this client is connected
      return;
    }

    //if connections is different to the connection array held locally then that means a new client has joined the server
    if (connections != game.connectionArray) {
      //this line gets the id which is present in the new connections array but not in the local connection array. 
      //therefore getting the new client who has joined
      let newClient = connections.filter(element => { return !game.connectionArray.includes(element); });
      latestClient = newClient;

      //do something with this info
      console.log(game.clientId);
      console.log("new client " + newClient);
      newClient.forEach(clientId => {
        console.log("new player");
        game.NewPlayer(clientId, {});
      });


      //update local copy of connections
      game.connectionArray = connections;
    }
  });

  socket.on("updatePlayerUsernames", usernames => {
    console.log(usernames);
    usernamesMap = new Map();
    usernames = JSON.parse(usernames);

    usernames.forEach(list => {
      usernamesMap.set(list[0], list[1]);
    });
    try {

      fetch(`http://localhost:3000/getProfilePicture/${usernamesMap.get(latestClient[0])}`).then(response => {
        response.json().then(json => {
          console.log(json);
          if (json.error != "no user found") {
            document.getElementById("enemyProfilePicture").src = "data:image/png;base64," + json.profilePicture;
          }
        })
      })
    }
    catch {
    }
  });

  socket.on("UpdateNetworkedPlayerPos", info => {
    //use info.id to find a player and then update its position using info.position
    game.UpdateNetworkedPlayer(info.id, info.position);
    if (game.players.get(info.id)) {
      game.players.get(info.id).SetAnimationFromVelocities(info.velocities);
    }
  })

  socket.on("NetworkedPlayerRotate", info => {
    //how to isolate y axis
    //reference https://stackoverflow.com/questions/54311982/how-to-isolate-the-x-and-z-components-of-a-quaternion-rotation
    let theta_y = Math.atan2(info.rotation[1], info.rotation[3]);
    let yRotation = [0, Math.sin(theta_y), 0, Math.cos(theta_y)];
    try {
      game.players.get(info.id).gltfScene.quaternion.set(yRotation[0], yRotation[1], yRotation[2], yRotation[3]);
    }
    catch {

    }
  })

  socket.on("NetworkedPlayerStoppedMoving", id => {
    try {
      game.players.get(id).SetAnimationFromVelocities({ forwardVelocity: 0, sidewaysVelocity: 0 });
    }
    catch {
    }
  })

  socket.on("GetClientPlayerIdPosition", () => {
    //try to send the player position however if the player hasnt loaded in yet just send a default position
    try {
      socket.emit("UpdatePlayerMovement", { position: game.player.position, id: game.clientId });
    }
    catch {
      socket.emit("UpdatePlayerMovement", { position: new THREE.Vector3(0, -0.245, 5), id: game.clientId });
    }
  })


  socket.on("removeId", id => {
    game.connectionArray = game.connectionArray.filter(connection => { connection != id });
  })

  socket.on("NetworkedPlayerDeath", info => {
  })

  socket.on("ResetClientHealth", () => {
    game.player.ResetHealth();
  });

  socket.on("networkedAttack", info => {
    console.log(info);
    try {
      game.players.get(info.id).children[0].PlayRandomAttack();
    }
    catch { };
  })

  socket.on("networkedStartBlock", id => {
  })

  socket.on("networkedEndBlock", id => {
  })

  socket.on("networkedPlayerInsult", info => {
    console.log(info.insultIndex);
    if (info.insultIndex == -1) {
      game.players.get(info.id).children[0].PlayRandomInsult();
      return;
    }
    try {
      game.players.get(info.id).children[0].PlayRandomInsult(info.insultIndex);
    }
    catch {
    }
  })

  //whenever the local player moves send it to the server
  document.addEventListener("OnClientMove", e => {
    try {
      socket.emit("UpdatePlayerMovement", { position: game.player.position, id: game.clientId, velocities: e.detail });
    }
    catch { };
  })

  document.addEventListener("OnClientStop", e => {
    socket.emit("clientStoppedMoving", game.clientId);
  });

  //make listener for player death
  document.addEventListener("PlayerDead", e => {
    socket.emit("PlayerDeath", { id: game.clientId });
  })

  document.addEventListener("Attack", e => {
    socket.emit("PlayerAttack", { id: game.clientId, attackAnimIndex: e.detail.attackAnimIndex });
  });

  document.addEventListener("startBlock", e => {
    socket.emit("startBlock", game.clientId);
  })

  document.addEventListener("endBlock", e => {
    socket.emit("endBlock", game.clientId);
  })

  document.addEventListener("Insult", e => {
    let insultIndex = game.players.get(game.clientId).children[0].PlayRandomInsult();
    console.log(insultIndex);
    socket.emit("PlayerInsult", { id: game.clientId, insultIndex: insultIndex });
  });

  document.addEventListener("OnClientRotate", e => {
    socket.emit("PlayerRotate", { rotation: e.detail.rotation, id: game.clientId });
  })

  function ClientDeath() {
    game.onClientDeath();
  }

  document.getElementById("deathButton").onclick = ClientDeath;


  //game loop
  function Animate() {
    requestAnimationFrame(t => {
      game.Update();
      Animate();
    });
  }

  Animate();




  if (sessionStorage.username) {
    document.getElementById("clientProfilePicture").src = sessionStorage.profilePicture.substring(4, sessionStorage.profilePicture.length)
  }