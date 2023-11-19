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
//const modelPromise = loader.loadAsync("./knightMan2.glb");
const modelPromise = loader.loadAsync("./knight-man-additive-complete.glb");
//const modelPromise = loader.loadAsync("./Xbot.glb")
//const modelPromise = loader.loadAsync("./spinningCube.glb");

let mixer;
let modelReady = false;
let Modelgltf;
let currentBaseAction;
let currentAdditiveAction;

function activateAction(action, weight){
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
    action.play();
}

function deactivateAction(action){
    action.enabled = false;
    action.setEffectiveWeight(0);
    action.stop();
}

let animations = {
    base: {
        idle: 0,
        walkForward: 1,
        walkBack: 2,
        walkLeft: 3,
        walkRight: 4,
    },
    additive: {
        block: 6,
        blockReact: 7,
        hitReactionGut: 8,
        hitReactionHead: 9,
        lightAttack: 10,
        heavyAttack: 11,
        walkForward: 12,
        idle: 13,
        walkBack: 14,
        walkLeft: 15,
        walkRight: 16
    }
}

document.addEventListener("ChangeBaseAnimation", e =>{
    deactivateAction(currentBaseAction);
    mixer.stopAllAction();
    Modelgltf.scene.rotation.y = 0;
    const clipIndex = e.detail.index;
    if(clipIndex == 5){
        const action = mixer.clipAction(Modelgltf.animations[clipIndex]);
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
        action.play();
        return;
    }
    const action = mixer.clipAction(Modelgltf.animations[clipIndex]);
    activateAction(action, 1);
})

document.addEventListener("ChangeAdditiveAnimation", e=>{
})


modelPromise.then((gltf)=>{
    Modelgltf = gltf;
    gltf.scene.rotation.y = -45;
    mixer = new THREE.AnimationMixer(gltf.scene);
    let skeleton = new THREE.SkeletonHelper(gltf.scene);
    skeleton.visible = false;
    scene.add(skeleton);

    const clip1Index = animations.base.walkRight;
    const clip2Index = animations.additive.block;


    const action1 = mixer.clipAction(gltf.animations[clip1Index]);
    activateAction(action1, 1);
    currentBaseAction = action1;


    THREE.AnimationUtils.makeClipAdditive(gltf.animations[clip2Index], 1, gltf.animations[clip1Index]);
    const action2 = mixer.clipAction(gltf.animations[clip2Index]);
    activateAction(action2, 1);
    currentAdditiveAction = action2;
    
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