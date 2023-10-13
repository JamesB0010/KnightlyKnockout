import *  as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// SCENE
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
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


document.body.appendChild(renderer.domElement);
animate();