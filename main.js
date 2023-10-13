import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';

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

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;

const floorGeometry = new THREE.BoxGeometry(5,0.5,5);
const floor = new THREE.Mesh(floorGeometry, material);
floor.position.y = -2;
floor.receiveShadow = true;

const direcLight = new THREE.DirectionalLight(0xffffff, 1);
direcLight.position.y = 2;
direcLight.castShadow = true;



scene.add( cube, floor, ambLight, direcLight, new THREE.DirectionalLightHelper(direcLight));

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

animate();