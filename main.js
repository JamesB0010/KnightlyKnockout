import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import {GameObject} from '/GameObject.js';
import {Game} from './Game.js';

let game = new Game();
game.Init();

function Animate(){
	requestAnimationFrame(Animate);
	game.Render();
}

Animate();