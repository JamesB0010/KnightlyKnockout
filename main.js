import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const clock = new THREE.Clock();

const loader = new GLTFLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
const controls = new OrbitControls( camera, renderer.domElement );
document.body.appendChild( renderer.domElement );


const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.setY(5);
const helper = new THREE.DirectionalLightHelper(directionalLight, 5);

const ambLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add( directionalLight, helper, ambLight );


const modelPromise = loader.loadAsync("./knightMan.glb");

let mixer;
let modelReady = false;
const animActions = [];


modelPromise.then((gltf)=>{
    mixer = new THREE.AnimationMixer(gltf.scene);


    const clip1 = mixer.clipAction(gltf.animations[36]);
    //36
    animActions.push(clip1);


    //14
    const clip2 = mixer.clipAction(gltf.animations[14]);
    animActions.push(clip2);
    THREE.AnimationUtils.makeClipAdditive(clip2.getClip());
    
    animActions[0].play();
    //animActions[1].play();
    
    scene.add(gltf.scene);
    modelReady = true;
})

camera.position.z = 5;


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    if(modelReady) mixer.update(clock.getDelta());
}
animate();