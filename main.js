import * as THREE from 'three';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const orbitControls = new OrbitControls(camera, renderer.domElement);

class Box extends THREE.Mesh{
    constructor({
		width,
		height,
		depth,
		color = '#00ff00',
		velocity = {
			x: 0,
			y:0,
			z:0
		}
	}){
        super(
            new THREE.BoxGeometry( width, height, depth), 
            new THREE.MeshStandardMaterial( { color} )
            );

			this.height = height;
			this.width = width;
			this.depth = depth;
			this.velocity = velocity;
    }
	FindBottomOfCube(){
		return this.position.y - this.height / 2;
	}
	FindTopOfCube(){
		return this.position.y + this.height / 2;
	}
	Update(){
		this.position.y += this.velocity.y;
	}
}

const cube = new Box({
	width: 1,
	height: 1,
	depth: 1,
	velocity:{
		x:0,
		y:-0.01,
		z:0
	}
});
cube.castShadow = true;

const direcLight = new THREE.DirectionalLight(0xffffff, 1);
direcLight.position.z = 2;
direcLight.position.y = 3;
direcLight.castShadow = true;


const ground = new Box({width:5, height:0.5, depth:10, color: '#0000ff'});
ground.receiveShadow = true;
ground.position.y = -2;

scene.add( cube );
scene.add(direcLight);
scene.add(ground);

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	cube.Update();
}


animate();