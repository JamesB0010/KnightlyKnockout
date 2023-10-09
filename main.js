//credits to Chris Courses Youtube video https://www.youtube.com/watch?v=sPereCgQnWQ
//Video titled: Three.js 3D Game Tutorial: In-Depth Course for All Levels
import * as THREE from 'three';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls';
import {CSS2DRenderer, CSS2DObject} from './node_modules/three/examples/jsm/renderers/CSS2DRenderer';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(4.61, 2.74, 8);

const renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true
});
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const orbitControls = new OrbitControls(camera, renderer.domElement);
const gravity = -0.008

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const H = document.createElement('h1');
H.textContent = "Controls";
const cPointLabel = new CSS2DObject(H);
scene.add(cPointLabel);
cPointLabel.position.set(-2, 4, 4);

const p1 = document.createElement('p');
p1.textContent = "WASD to move around";
const cPointLabel2 = new CSS2DObject(p1);
scene.add(cPointLabel2);
cPointLabel2.position.set(-3, 3.75, 3.9);

const p2 = document.createElement('p');
p2.textContent = "Space to jump";
const cPointLabel3 = new CSS2DObject(p2);
scene.add(cPointLabel3);
cPointLabel3.position.set(-16, 4.5, 2.5);

const p3 = document.createElement('p');
p3.textContent = "left mouse to rotate camera, right mouse to translate camera";
const cPointLabel4 = new CSS2DObject(p3);
scene.add(cPointLabel4);
cPointLabel4.position.set(-40, 4.5, -5.5);

const p4 = document.createElement('p');
p4.textContent = "scroll to zoom in/out,";
const cPointLabel5 = new CSS2DObject(p4);
scene.add(cPointLabel5);
cPointLabel5.position.set(-1000, -10, -110);

function boxCollision({
	box1,
	box2
}){
	let aboveFloorTop = box1.FindBottomOfCube() + box1.velocity.y <= box2.FindTopOfCube(); //+ box2.velocity.y;

		let belowFloorBottom = box1.FindTopOfCube() + box1.velocity.y >= box2.FindBottomOfCube(); //+ box2.velocity.y;

		let rightOfFloorLeft = box1.FindRightOfCube() + box1.velocity.x  >= box2.FindLeftOfCube(); //+ box2.velocity.x;

		let leftOfFloorRight = box1.FindLeftOfCube() + box1.velocity.x <= box2.FindRightOfCube(); //+ box2.velocity.x;

		let backOfFloorFront = box1.FindRearOfCube() + box1.velocity.z <= box2.FindFrontOfCube(); //+ box2.velocity.z;

		let forwardOfFloorBack = box1.FindFrontOfCube() + box1.velocity.z >= box2.FindRearOfCube(); //+ box2.velocity.z;

		let onGround = aboveFloorTop && rightOfFloorLeft && leftOfFloorRight && backOfFloorFront && forwardOfFloorBack && belowFloorBottom;

		return onGround;
}

class Box extends THREE.Mesh{
    constructor({
		width,
		height,
		depth,
		position = {
			x: 0,
			y: 0,
			z: 0
		},
		color = '#00ff00',
		velocity = {
			x: 0,
			y:0,
			z:0
		},
		zAcceleration = false
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
			this.position.x = position.x;
			this.position.y = position.y;
			this.position.z = position.z;
			this.zAcceleration = zAcceleration;
			this.grounded = false;
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
			const friction = 0.3
			this.velocity.y *= friction;
			this.velocity.y = -this.velocity.y;
			this.grounded = true;
		}
		else{
			this.position.y += this.velocity.y;
			this.grounded = false;
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

		if(this.zAcceleration){
			this.velocity.z += 0.001;
		}
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
	},
	position: {
		x: 0,
		y: 0,
		z: 3
	},
	zAcceleration: false
});
cube.castShadow = true;

const direcLight = new THREE.DirectionalLight(0xffffff, 2);
direcLight.position.z = 1;
direcLight.position.y = 3;
direcLight.castShadow = true;


const ground = new Box({width:10, height:0.5, depth:50, color: '#0369a1'});
ground.receiveShadow = true;
ground.position.y = -2;

scene.add( cube );
scene.add(direcLight);
scene.add(ground);

scene.add(new THREE.AmbientLight(0xffffff, 1));

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
		case 'Space':
			if(cube.grounded){
				cube.velocity.y = 0.16;
				break;
			}
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

const enemy = new Box({
	width: 1,
	height: 1,
	depth: 1,
	position: {
		x: 0,
		y: 0,
		z: -20
	},
	velocity:{
		x:0,
		y:-0.01,
		z:0.05
	},
	color: 'red',
	zAcceleration: true
});
enemy.castShadow = true;
scene.add(enemy);

const enemies = [enemy];

let frames = 1;
let spawnRate = 100;
function animate() {
	const animationId = requestAnimationFrame( animate );
	labelRenderer.render(scene, camera);
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

	enemies.forEach(enemy => {
		enemy.Update(ground);
		if (boxCollision({
			box1: cube,
			box2: enemy
		})){
			window.cancelAnimationFrame(animationId);
		}
	});

	if(frames % spawnRate == 0){
		if(spawnRate > 20) spawnRate -= 20;

		enemies.push(
			new Box({
				width: 1,
				height: 1,
				depth: 1,
				position: {
					x: (Math.random() - 0.5) * 10,
					y: 0,
					z: -20
				},
				velocity:{
					x:0,
					y:-0.01,
					z:0.05
				},
				color: 'red',
				zAcceleration: true
			}));
		enemy.castShadow = true;
		scene.add(enemies[enemies.length - 1]);
	}

	frames++;
}


animate();

