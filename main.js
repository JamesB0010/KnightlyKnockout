import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import {GameObject} from './GameObject.js';

new GameObject();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls =  new OrbitControls(camera, renderer.domElement);

const ambLight = new THREE.AmbientLight(0xffffff, 0.1);

const cube = new GameObject();

const floorGeometry = new THREE.BoxGeometry(10,0.5,10);
const floor = new THREE.Mesh(floorGeometry, new THREE.MeshStandardMaterial({color:0xffffff}));
floor.position.y = -2;
floor.receiveShadow = true;

const direcLight = new THREE.DirectionalLight(0xffffff, 1);
direcLight.position.y = 2;
direcLight.castShadow = true;



scene.add( cube, floor, ambLight, direcLight, new THREE.DirectionalLightHelper(direcLight));

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();