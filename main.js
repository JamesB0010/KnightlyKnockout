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


//const modelPromise = loader.loadAsync("./knightMan.glb");
const modelPromise = loader.loadAsync("./knightMan2.glb");
//const modelPromise = loader.loadAsync("./Xbot.glb")
//const modelPromise = loader.loadAsync("./spinningCube.glb");

let mixer;
let modelReady = false;

function activateAction(action, weight){
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
    action.play();
}


modelPromise.then((gltf)=>{
    mixer = new THREE.AnimationMixer(gltf.scene);
    let skeleton = new THREE.SkeletonHelper(gltf.scene);
    skeleton.visible = false;
    scene.add(skeleton);


    const action1 = mixer.clipAction(gltf.animations[1]);
    activateAction(action1, 1);


    THREE.AnimationUtils.makeClipAdditive(gltf.animations[0], 1, gltf.animations[1]);
    const action2 = mixer.clipAction(gltf.animations[0]);
    activateAction(action2, 1);
    
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