import { Game } from './Game.js';

const socket = io(); // create new socket instance

//add a game loading screen;

let game = new Game();
game.Init();

socket.on("setId", id => {
  console.log(game.player);
  game.NewLocalPlayer(id);
  game.player.socketId = id;
})

socket.on("updateNetworkedPlayerPosition", data => {
  game.UpdateNetworkedObjectPos(data);
})

socket.on("RemovePlayer", id => {
  game.RemovePlayer(id);
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