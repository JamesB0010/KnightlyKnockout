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

const direcLight = new THREE.DirectionalLight(0xffffff, 1.5);
const helper = new THREE.DirectionalLightHelper( direcLight, 1.5 );
direcLight.position.y = 4;
direcLight.castShadow = true;
scene.add(direcLight, helper);

const geometry = new THREE.TorusKnotGeometry( 1.8, 0.6, 100, 16 ); 
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
scene.add(cube);

const floor = new THREE.BoxGeometry(100,0.5,100);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const floorCube = new THREE.Mesh(floor, floorMaterial);
floorCube.position.y = -4;
floorCube.recieveShadow = true;
scene.add(floorCube);


const ambLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambLight);

let keyMap = {
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  a:{
    pressed: false
  },
  d:{
    pressed:false
  }
};

// window.addEventListener('keydown', (e) =>{
//   if(e.key == "w"){
//     keyMap.w.pressed = true;
//   }
//   if(e.key == "s"){
//     keyMap.s.pressed = true;
//   }
//   if(e.key == "a"){
//     keyMap.a.pressed = true;
//   }
//   if(e.key == "d"){
//     keyMap.d.pressed = true;
//   }
// })

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // if(keyMap.w.pressed){
  //   cube.position.z += 0.01;
  // }
  renderer.render(scene, camera);
}

animate();