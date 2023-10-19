import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import {GameObject} from '/GameObject.js';
import {Game} from './Game.js';
import {io} from 'socket.io-client';
import {FirstPersonControls} from './node_modules/three/examples/jsm/controls/FirstPersonControls';

//setup socket io
const socket = io("http://localhost:3000");

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