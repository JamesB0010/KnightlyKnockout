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

function prepareCrossFade(startAction, endAction, duration){
    //if the current action is 'idleBase', execute the crossfade immediately;
    //else wait until the current action has finished its current loop

    if(currentBaseAction === 'idleBase' || ! startAction || !endAction){
        executeCrossFade(startAction, endAction, duration);
    }
    else{
        synchronizeCrossFade(startAction, endAction, duration);
    }

    if(endAction){
        const clip = endAction.getClip();
        currentBaseAction = clip.name;
    }
    else{
        currentBaseAction = 'None';
    }
}

function synchronizeCrossFade(startAction, endAction, duration){
    mixer.addEventListener('loop', onLoopFinished);

    function onLoopFinished(event){
        if (event.action == startAction){
            mixer.removeEventListener('loop', onLoopFinished);

            executeCrossFade(startAction, endAction, duration);
        }
    }
}

//this function is needed, since animationAction.crossFadeTo() disables its start action and sets
//the start actions timescale to ((start animations duration) / (end animations duration))
function executeCrossFade(startAction, endAction, duration){
    //not only the start action, but also the end action must have a weight of 1 before fading
    //for start action this is the case
    if (endAction){
        setWeight(endAction, 1);
        endAction.time = 0;

        if(startAction){
            //crossfade with warping
            startAction.crossFadeTo(endAction, duration, true);
        }
        else{
            endAction.fadeIn(duration);
        }
    }
    else{
        //fade out
        startAction.fadeOut(duration);
    }
}

function PlayDeathAnimation(){
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

document.addEventListener("ChangeBaseAnimation", e =>{
    if(e.detail.name == "death"){
        PlayDeathAnimation();
        return;
    }

    if (e.detail.name != currentBaseAction){
        prepareCrossFade(baseActions[currentBaseAction].action, baseActions[e.detail.name].action, 0.35);
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