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
<<<<<<< HEAD
renderer.shadowMap.enabled = true

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

// INIT CAMERA
camera.position.z = 25;
camera.position.x = 3;
camera.position.y = 6;
camera.lookAt(0, 0, -20)

// INIT HEMISPHERE LIGHT
scene.add(new THREE.AmbientLight( 0xffffff, 0.5 ));

// SCENE
scene.background = new THREE.Color(0xffffff);

// FLOOR
const plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, 32), new THREE.MeshPhongMaterial({ color: 0xfab74b}));
plane.rotation.x = - Math.PI / 2
plane.receiveShadow = true
scene.add(plane);

// CONE
const cone = new THREE.Mesh(new THREE.ConeGeometry(2, 5, 64), new THREE.MeshPhongMaterial({ color: 0xdbde40 }));
cone.position.set(7, 2.5, 2.7)
cone.receiveShadow = true
cone.castShadow = true
scene.add(cone);

// DIRECTIONAL LIGHT
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.x += 20
directionalLight.position.y += 20
directionalLight.position.z += 20
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
const d = 25;
directionalLight.shadow.camera.left = - d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = - d;
scene.add(directionalLight);

//scene.add( new THREE.CameraHelper( directionalLight.shadow.camera ) );


// ANIMATE
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


=======
>>>>>>> parent of 1d432df (copied working shadow code)
document.body.appendChild(renderer.domElement);
const orbitControls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

const direcLight = new THREE.PointLight(0xffffff, 200);
const helper = new THREE.PointLightHelper( direcLight, 1.5 );
direcLight.position.y = 4;
direcLight.castShadow = true;
scene.add(direcLight, helper);

const geometry = new THREE.TorusKnotGeometry( 1.8, 0.6, 100, 16 ); 
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
scene.add(cube);

const floor = new THREE.BoxGeometry(100,0.5,100);
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const floorCube = new THREE.Mesh(floor, floorMaterial);
floorCube.position.y = -4;
floorCube.recieveShadow = true;
scene.add(floorCube);


const ambLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambLight);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();