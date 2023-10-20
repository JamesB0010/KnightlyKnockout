import {Game} from './Game.js';

const socket = io(); // create new socket instance

let game = new Game();
game.Init();

socket.on("setId", id =>{
  game.NewLocalPlayer(id);
  game.player.socketId = id;
})

socket.on("updateNetworkedPlayerPosition", data =>{
  game.UpdateNetworkedObjectPos(data);
})

socket.on("RemovePlayer", id=>{
  game.RemovePlayer(id);
})

function Animate(){
  requestAnimationFrame(t =>{
    game.Update(socket, t);
    Animate();
  });
}

Animate();