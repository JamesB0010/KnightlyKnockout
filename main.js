//reference for setup/hello world code:  Threejs.org/docs
import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  alpha:true,
  antialias:true
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const orbitControls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

const geometry = new THREE.TorusKnotGeometry( 1.8, 0.6, 100, 16 ); 
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.recieveShadow = true;
scene.add(cube);

const floor = new THREE.BoxGeometry(100,0.5,100);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const floorCube = new THREE.Mesh(floor, floorMaterial);
floorCube.position.y = -2;
floorCube.recieveShadow = true;
scene.add(floorCube);

const direcLight = new THREE.DirectionalLight(0xffffff, 1.5);
direcLight.position.y = 1;
direcLight.castShadow = true;
scene.add(direcLight);


const ambLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambLight);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();