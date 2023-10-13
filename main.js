import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import {GameObject} from '/GameObject.js';

//#region Setup
//create scene
const scene = new THREE.Scene();

//create camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

//create renderer
const renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//add orbit controls
const controls =  new OrbitControls(camera, renderer.domElement);
//#endregion


//#region Lights
const ambLight = new THREE.AmbientLight(0xffffff, 0.1);
const direcLight = new THREE.DirectionalLight(0xffffff, 1);
direcLight.position.y = 2;
direcLight.castShadow = true;
scene.add(ambLight, direcLight, new THREE.DirectionalLightHelper(direcLight));

//#endregion

//#region AddingGeometry

const cube = new GameObject();

const floorGeometry = new THREE.BoxGeometry(10,0.5,10);
const floor = new THREE.Mesh(floorGeometry, new THREE.MeshStandardMaterial({color:0xffffff}));
floor.position.y = -2;
floor.receiveShadow = true;

scene.add( cube, floor);

//#endregion

//#region animateFunction

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

//#endregion


//#region Main
animate();

//#endregion