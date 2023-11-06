import { Game } from './Game.js';
import * as THREE from 'three';

const socket = io(); // create new socket instance

//add a game loading screen;

//create a new game and initialise it
let game = new Game();
game.Init();


//setup socket listeners
//when a client joins the server a setId message will be sent to the client, they set their client id and connection array and make a new player
socket.on("setId", id => {
  game.clientId = id;
  game.connectionArray.push(id);
  game.NewPlayer(id, {color:0xffffff, inputEnabled: true});
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

socket.on("UpdateNetworkedPlayerPos", info=>{
  //use info.id to find a player and then update its position using info.position
  game.UpdateNetworkedPlayer(info.id, info.position);
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

//whenever the local player moves send it to the server
document.addEventListener("OnClientMove", e =>{
  socket.emit("UpdatePlayerMovement", {position:game.player.position, id: game.clientId});
})


//game loop
function Animate() {
  requestAnimationFrame(t => {
    game.Update();
    Animate();
  });
}

Animate();