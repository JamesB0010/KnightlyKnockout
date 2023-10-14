import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import {GameObject} from '/GameObject.js';
import {Game} from './Game.js';
import {io} from 'socket.io-client';

//setup socket io
const socket = io("http://localhost:3000");

let game = new Game();
game.Init();

socket.on("setId", id =>{
	game.player.socketId = id;
})

socket.on("updateNetworkedPlayerPosition", data =>{
	game.UpdateNetworkedObjectPos(data);
})

function Animate(){
	requestAnimationFrame(Animate);
	game.Update(socket);
}

Animate();