import * as THREE from 'three';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const orbitControls = new OrbitControls(camera, renderer.domElement);
const gravity = -0.008

function boxCollision({
	box1,
	box2
}){
	let aboveFloorTop = box1.FindBottomOfCube() + box1.velocity.y <= box2.FindTopOfCube() + box2.velocity.y;

		let belowFloorBottom = box1.FindTopOfCube() + box1.velocity.y >= box2.FindBottomOfCube() + box2.velocity.y;

		let rightOfFloorLeft = box1.FindRightOfCube() + box1.velocity.x  >= box2.FindLeftOfCube() + box2.velocity.x;

		let leftOfFloorRight = box1.FindLeftOfCube() + box1.velocity.x <= box2.FindRightOfCube() + box2.velocity.x;

		let backOfFloorFront = box1.FindRearOfCube() + box1.velocity.z <= box2.FindFrontOfCube() + box2.velocity.z;

		let forwardOfFloorBack = box1.FindFrontOfCube() + box1.velocity.z >= box2.FindRearOfCube() + box2.velocity.z;

		let onGround = aboveFloorTop && rightOfFloorLeft && leftOfFloorRight && backOfFloorFront && forwardOfFloorBack && belowFloorBottom;

		return onGround;
}

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
			this.speed = 0.05;
    }
	FindBottomOfCube(){
		return this.position.y - this.height / 2;
	}
	FindTopOfCube(){
		return this.position.y + this.height / 2;
	}
	FindRightOfCube(){
		return this.position.x + this.width /2;
	}
	FindLeftOfCube(){
		return this.position.x - this.width / 2;
	}
	FindFrontOfCube(){
		return this.position.z + this.depth / 2;
	}

	FindRearOfCube(){
		return this.position.z - this.depth / 2;
	}
	ApplyGravity(ground){
		this.velocity.y += gravity;

		let onGround = boxCollision({
			box1: this,
			box2: ground
		})

		//this is where we hit the ground
		if (onGround){
			this.velocity.y *= 0.5;
			this.velocity.y = -this.velocity.y;
		}
		else{
			this.position.y += this.velocity.y;
		}
	}

	ApplyXVelocity(){
		this.position.x += this.velocity.x;
	}
	ApplyZVelocity(){
		this.position.z += this.velocity.z;
	}
	Update(ground){
		this.ApplyXVelocity();
		this.ApplyZVelocity();
		this.ApplyGravity(ground);
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

const keys = {
	a: {
		pressed: false
	},
	d:{
		pressed: false
	},
	w:{
		pressed: false
	},
	s:{
		pressed:false
	}
}

window.addEventListener('keydown', (e) =>{
	switch(e.code){
		case 'KeyA':
			keys.a.pressed = true;
			break;
		case 'KeyD':
			keys.d.pressed = true;
			break;
		case 'KeyW':
			keys.w.pressed = true;
			break;
		case 'KeyS':
			keys.s.pressed = true;
			break;
	}

})

window.addEventListener('keyup', (e) =>{
	switch(e.code){
		case 'KeyA':
			keys.a.pressed = false;
			break;
		case 'KeyD':
			keys.d.pressed = false;
			break;
		case 'KeyW':
			keys.w.pressed = false;
			break;
		case 'KeyS':
			keys.s.pressed = false;
			break;
	}

})


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

	//add movement code for cube
	cube.velocity.x = 0;
	if(keys.a.pressed){
		cube.velocity.x = -cube.speed;
	}
	else if (keys.d.pressed){
		cube.velocity.x = cube.speed;
	}

	cube.velocity.z = 0;
	if (keys.w.pressed){
		cube.velocity.z = -cube.speed;
	}
	else if(keys.s.pressed){
		cube.velocity.z = cube.speed;
	}


	cube.Update(ground);
}


animate();

