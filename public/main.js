import { Game } from './Game.js';

const socket = io(); // create new socket instance

//add a game loading screen;

let game = new Game();
game.Init();

socket.on("setId", id => {
  game.clientId = id;
  game.connectionArray.push(id);
  game.NewPlayer(id, {color:0xffffff, inputEnabled: true});
})

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

socket.on("updateNetworkedPlayerPosition", data => {
  game.UpdateNetworkedObjectPos(data);
})

socket.on("removeId", id =>{
  game.connectionArray = game.connectionArray.filter(connection => {connection != id});
})

function Animate() {
  requestAnimationFrame(t => {
    game.Update(socket, t);
    Animate();
  });
}

//credits to https://www.youtube.com/watch?v=leAbQ0yfVX0 for how to use pointer lock
game.renderer.domElement.onclick = () => {
  document.body.requestPointerLock();
}

Animate();