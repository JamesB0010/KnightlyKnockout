//reference for code used to create this https://github.com/mrdoob/three.js/blob/dev/examples/webgl_animation_skinning_additive_blending.html#L275


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
let model;

const allActions = [];
const baseActions = {
    idleBase:{weight: 0},
    walkForwardBase :{weight: 1},
    walkBackBase:{weight: 0},
    walkLeftBase:{weight: 0},
    walkRightBase:{weight: 0},
    death:{weight: 0}
}

const additiveActions = {
    blockIdle: {weight: 0},
    blockReact: {weight: 0},
    hitReactionGut: {weight: 0},
    hitReactionHead: {weight: 0},
    lightAttack: {weight: 0},
    heavyAttack: {weight: 0},
    walkForwardAdditive: {weight: 1},
    idleAdditive: {weight: 0},
    walkBackAdditive: {weight: 0},
    walkLeftAdditive: {weight: 0},
    walkRightAdditive: {weight: 0}
}

let currentAdditiveAction = "walkForwardAdditive";
let currentBaseAction = "walkForwardBase";

let numAnimations;

function setWeight(action, weight){
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
}

function activateAction(action){
    const clip = action.getClip();
    const settings = baseActions[clip.name] || additiveActions[clip.name];
    setWeight(action, settings.weight);
    action.stop();
    action.play();
}

document.addEventListener("ChangeBaseAnimation", e =>{
    if(e.detail.name == "death"){
        model.rotation.y = 0;

        baseActions[currentBaseAction].weight = 0;
        additiveActions[currentAdditiveAction].weight = 0;
        baseActions['death'].weight = 1;
        baseActions['death'].action.clampWhenFinished = true;

        
        activateAction(baseActions["death"].action);
        activateAction(baseActions[currentBaseAction].action);
        activateAction(additiveActions[currentAdditiveAction].action);
        currentAdditiveAction = null;
        currentBaseAction = "death";
    }
})

document.addEventListener("ChangeAdditiveAnimation", e=>{
    additiveActions[currentAdditiveAction].weight = 0;
    additiveActions[e.detail.name].weight = 1;
    activateAction(additiveActions[e.detail.name].action);
    activateAction(additiveActions[currentAdditiveAction].action);
    currentAdditiveAction = e.detail.name;
})


modelPromise.then((gltf)=>{
    model = gltf.scene;
    //rotate a quater
    model.rotation.y = -Math.PI * 0.25;
    scene.add(model);
    modelReady = true;

    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    
    numAnimations = animations.length;

    for(let i = 0; i !== numAnimations; i++){
        let clip = animations[i];
        const name = clip.name;

        if(baseActions[name]){
            const action = mixer.clipAction(clip);
            activateAction(action);
            baseActions[name].action = action;
            allActions.push(action);
        }
        else if(additiveActions[name]){
            //make the clip additive
            THREE.AnimationUtils.makeClipAdditive(clip, 1, baseActions["walkForwardBase"].action.getClip());

            const action = mixer.clipAction(clip);
            activateAction(action);
            additiveActions[name].action = action;
            allActions.push(action);
        }
    }
})

camera.position.z = 5;


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    if(modelReady) mixer.update(clock.getDelta());
}
animate();