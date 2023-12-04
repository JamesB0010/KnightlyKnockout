import { Game } from '/game.js';
import * as THREE from 'three';

const socket = io(); // create new socket instance

//add a game loading screen;

//create a new game and initialise it
let game = new Game();
game.Init();
let usernamesMap = new Map();


//setup socket listeners
//when a client joins the server a setId message will be sent to the client, they set their client id and connection array and make a new player
socket.on("setId", id => {
  game.clientId = id;
  game.connectionArray.push(id);
  game.NewPlayer(id, {color:0xffffff, inputEnabled: true});
  if(sessionStorage.username){
    socket.emit("profileInfo", sessionStorage.username)
  }
})

//whenever a player joins the server send the cupdateConnectionsArr message to all clients 
socket.on("updateConnectionsArr", (connections)=>{
  if(connections.length == 1){
    //only this client is connected
    return;
  }

  //if connections is different to the connection array held locally then that means a new client has joined the server
  if(connections != game.connectionArray){
    //this line gets the id which is present in the new connections array but not in the local connection array. 
    //therefore getting the new client who has joined
     let newClient = connections.filter(element =>{ return !game.connectionArray.includes(element);});


     fetch(`http://localhost:3000/getProfilePicture/${usernamesMap.get(newClient[0])}`).then(response =>{
    response.json().then(json =>{
      document.getElementById("enemyProfilePicture").src = "data:image/png;base64," + json.profilePicture;
    })
  })

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

socket.on("updatePlayerUsernames", usernames =>{
  usernamesMap = new Map();
  usernames = JSON.parse(usernames);

  usernames.forEach(list => {
    usernamesMap.set(list[0], list[1]);
  });
});

socket.on("UpdateNetworkedPlayerPos", info=>{
  //use info.id to find a player and then update its position using info.position
  game.UpdateNetworkedPlayer(info.id, info.position);
  if(game.players.get(info.id)){
    game.players.get(info.id).SetAnimationFromVelocities(info.velocities);
  }
})

socket.on("NetworkedPlayerRotate", info =>{
  console.log(info.rotation);
  const radians = info.rotation > 0? info.rotation: (2 * Math.PI) + info.rotation;
  game.players.get(info.id).gltfScene.rotation.y = radians;
})

socket.on("NetworkedPlayerStoppedMoving", id =>{
  game.players.get(id).SetAnimation(6);
})

socket.on("GetClientPlayerIdPosition", () =>{
  //try to send the player position however if the player hasnt loaded in yet just send a default position
  try{
    socket.emit("UpdatePlayerMovement", {position:game.player.position, id: game.clientId});
  }
  catch{
    socket.emit("UpdatePlayerMovement", {position: new THREE.Vector3(0, -0.245, 5), id: game.clientId});
  }
})


socket.on("removeId", id =>{
  game.connectionArray = game.connectionArray.filter(connection => {connection != id});
})

socket.on("NetworkedPlayerDeath", info =>{
  game.players.get(info.id).SetAnimation(3);
  setTimeout(() =>{
    game.roundManager.playerDead(info.id);
    game.players.get(info.id).ResetToIdleAnim();
  }, 5000)
})

socket.on("ResetClientHealth", () =>{
  game.player.ResetHealth();
});

socket.on("networkedAttack", info =>{
  console.log(info);
  game.players.get(info.id).children[0].PlayRandomAttack();
  game.players.get(info.id).SetAnimation(info.attackAnimIndex);
})

socket.on("networkedStartBlock", id =>{
  game.players.get(id).SetAnimation(1);
})

socket.on("networkedEndBlock", id =>{
  game.players.get(id).SetAnimation(6);
})

socket.on("networkedPlayerInsult", info =>{
  console.log(info.insultIndex);
  if(info.insultIndex == -1){
    game.players.get(info.id).children[0].PlayRandomInsult();
    return;
  }
  game.players.get(info.id).children[0].PlayRandomInsult(info.insultIndex);
})

//whenever the local player moves send it to the server
document.addEventListener("OnClientMove", e =>{
  socket.emit("UpdatePlayerMovement", {position:game.player.position, id: game.clientId, velocities: e.detail});
})

document.addEventListener("OnClientStop", e =>{
  socket.emit("clientStoppedMoving", game.clientId);
});

//make listener for player death
document.addEventListener("PlayerDead", e =>{
  socket.emit("PlayerDeath", {id: game.clientId});
})

document.addEventListener("Attack", e=>{
  socket.emit("PlayerAttack", {id: game.clientId, attackAnimIndex: e.detail.attackAnimIndex});
});

document.addEventListener("startBlock", e =>{
  socket.emit("startBlock", game.clientId);
})

document.addEventListener("endBlock", e =>{
  socket.emit("endBlock", game.clientId);
})

document.addEventListener("Insult", e =>{
  let insultIndex = game.players.get(game.clientId).children[0].PlayRandomInsult();
  console.log(insultIndex);
  socket.emit("PlayerInsult", {id:game.clientId, insultIndex: insultIndex});
} );

document.addEventListener("OnClientRotate", e =>{
  socket.emit("PlayerRotate", {rotation: e.detail.rotation, id: game.clientId});
})

function ClientDeath(){
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




if(sessionStorage.username){
  document.getElementById("clientProfilePicture").src = sessionStorage.profilePicture.substring(4,sessionStorage.profilePicture.length)
}