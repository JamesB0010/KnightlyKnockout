import * as THREE from 'three';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const orbitControls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;

const direcLight = new THREE.DirectionalLight(0xffffff, 1);
direcLight.position.z = 2;
direcLight.position.y = 3;
direcLight.castShadow = true;

const ground = new THREE.Mesh( 
	new THREE.BoxGeometry( 5, 0.5, 10 ), 
	new THREE.MeshStandardMaterial( { color: 0x0000ff } ) 
	);
	ground.receiveShadow = true;
ground.position.y = -2;

scene.add( cube );
scene.add(direcLight);
scene.add(ground);

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();