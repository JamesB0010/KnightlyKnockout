//import * as THREE from 'three';
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js";
import { GLTFLoader } from "./GLTFLoader.js";

const gravity = -0.002;

let bloodSplatterDom = document.getElementsByClassName("bloodSplatter")[0];

//a Game object is mainly used to make the player, however can be used to make static things in the scene
//by default a game object is a cube but a gltf scene can be passed to give it a custom model

class GameObject extends THREE.Mesh {
    health = 100;
    #animationMixer;
    #allActions = [];
    #model;
    #leftFoot;
    #baseActions = {
        idleBase: { weight: 1 },
        walkForwardBase: { weight: 0 },
        walkBackBase: { weight: 0 },
        walkLeftBase: { weight: 0 },
        walkRightBase: { weight: 0 },
        death: { weight: 0 }
    }

    #additiveActions = {
        blockIdle: { weight: 0, priority: 2 },
        blockReact: { weight: 0, priority: 1 },
        hitReactionGut: { weight: 0, priority: 1 },
        hitReactionHead: { weight: 0, priority: 1 },
        lightAttack: { weight: 0, priority: 2 },
        heavyAttack: { weight: 0, priority: 2 },
        walkForwardAdditive: { weight: 0, priority: 3 },
        idleAdditive: { weight: 1, priority: 3 },
        walkBackAdditive: { weight: 0, priority: 3 },
        walkLeftAdditive: { weight: 0, priority: 3 },
        walkRightAdditive: { weight: 0, priority: 3 }
    }

    #currentAdditiveAction = "idleAdditive";
    #currentBaseAction = "idleBase";
    #numAnimations;
    #isBlocking = false;
    constructor({
        height = 1,
        width = 1,
        depth = 1,
        position = {
            x: 0,
            y: 0,
            z: 0
        },
        color = 0xffffff,
        inputEnabled = false,
        socketId = -1,
        Geometry = new THREE.BoxGeometry(0, 0, 0),
        Material = new THREE.MeshStandardMaterial({ color: 0xffffff }),
        scale = 1,
        gltfScene = null,
        gltfFile = null
    }) {
        super(
            Geometry,
            Material
        );
        this.castShadow = true;
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
        this.receiveShadow = true;
        this.height = height;
        this.width = width;
        this.depth = depth;

        //not optimal better to scale actual mesh
        this.scale.set(scale, scale, scale);

        //if a gltf scene is passed this wont be null
        this.#model = gltfScene;
        this.gltfScene = gltfScene;
        this.gltfFile = gltfFile;

        //if input enabled (ie, this is the local player)
        if (inputEnabled) {
            //this.#model.children[0].visible = false;
            document.addEventListener("Attack", () => {
                this.children[0].PlayRandomAttack();
            });
        }

        //set the gltf scene position if its not null
        if (gltfScene) {
            this.#model.position.x = position.x;
            this.#model.position.y = -0.78;
            this.#model.position.z = position.z;
            //this.#model.scale.multiplyScalar(0.6);

            //setup animations stuff
            this.#leftFoot = this.#model.getObjectByName('mixamorigLeftFoot');
            //rotate a quater
            this.#model.rotation.y = -Math.PI * 0.25;

            //setup animations

            const animations = gltfFile.animations;

            this.#animationMixer = new THREE.AnimationMixer(gltfScene);

            this.#numAnimations = animations.length;

            for (let i = 0; i != this.#numAnimations; i++) {
                let clip = animations[i];
                const name = clip.name;

                if (this.#baseActions[name]) {
                    const action = this.#animationMixer.clipAction(clip);
                    this.#activateAction(action);
                    this.#baseActions[name].action = action;
                    this.#allActions.push(action);
                }
                else if (this.#additiveActions[name]) {
                    //make the clip additive
                    THREE.AnimationUtils.makeClipAdditive(clip, 0, this.#baseActions["walkForwardBase"].action.getClip());


                    const action = this.#animationMixer.clipAction(clip);
                    this.#activateAction(action);
                    this.#additiveActions[name].action = action;
                    this.#allActions.push(action);
                }
            }

            //load the "right walk" animation as for some reason was not able to include it in the main knight glb file
            new GLTFLoader().loadAsync("../GameAssets/Models/Player/knightManWalkRight.glb").then(gltf => {
                const clip = gltf.animations[0];
                const name = "walkRightAdditive";
                THREE.AnimationUtils.makeClipAdditive(clip, 0, this.#baseActions["walkForwardBase"].action.getClip());
                const action = this.#animationMixer.clipAction(clip);
                this.#activateAction(action);
                this.#additiveActions[name].action = action;
                this.#allActions.push(action);
            })
        }

        this.velocity = {
            x: 0,
            y: 0,
            z: 0
        };
        this.grounded = false;

        this.bounciness = 0.6;

        this.socketId = socketId;
    }
    updateGltfPosition() {
        this.#model.position.x = this.position.x;
        this.#model.position.z = this.position.z;
    }

    SetIsBlocking(val){
        this.#isBlocking = val;
    }

    GetIsBlocking(){
        return this.#isBlocking;
    }

    UpdateAnimMixer(deltaTime) {
        this.#animationMixer.update(deltaTime);
        this.#leftFoot.rotation.order = "YZX";
        this.#leftFoot.rotation.x -= 0.27 * Math.PI;
        // this.#leftFoot.children[0].rotation.order = "YZX";
        // this.#leftFoot.children[0].rotation.x += 0.1 * Math.PI;
    }

    Attack(animName) {
        this.#ChangeAdditiveAnimation(animName);
    }

    StartBlock() {
        this.#ChangeAdditiveAnimation("blockIdle");
    }

    EndBlock() {
        this.#ChangeAdditiveAnimation(this.#FindLinkedBaseAnimFromAdditive(this.#currentBaseAction), true);
    }

    UpdateBloodSpatterOpacity() {
        bloodSplatterDom.style["opacity"] = 1 - this.health / 100;
    }

    Heal(amount) {
        if (this.health == 0) {
            return;
        }
        if (this.health < 100) {
            this.health += amount;
            console.log(this.health);
            this.UpdateBloodSpatterOpacity();
        }
    }

    PlayHurtAnimation(attackType){
        if(attackType == "lightAttack"){
            this.#ChangeAdditiveAnimation("hitReactionGut");
        }
        else if (attackType == "heavyAttack"){
            this.#ChangeAdditiveAnimation("hitReactionHead");
        }
    }

    PlayBlockReactAnim(){
        this.#ChangeAdditiveAnimation("blockReact");
    }

    GetSWingingAnimName(){
        if(this.#additiveActions["lightAttack"].weight == 1){
            return "lightAttack";
        }
        else if(this.#additiveActions["heavyAttack"].weight == 1){
            return "heavyAttack";
        }
        return "null";
    }
    Damage(amount) {
        //return true if this damage caused the player to die
        if (this.health > 0) {
            this.health -= amount;
            console.log(this.health);
            this.UpdateBloodSpatterOpacity();
        }
        if (this.health <= 0) {
            //player has died
            console.log("player has died");
            return true;
        }
        else {
            return false;
        }
    }

    GetPosition() {
        return this.#model.position;
    }

    ResetHealth() {
        this.health = 100;
        this.UpdateBloodSpatterOpacity();
    }

    //animation stuff
    #SetWeight(action, weight) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }

    #activateAction(action) {
        const clip = action.getClip();
        const settings = this.#baseActions[clip.name] || this.#additiveActions[clip.name];
        this.#SetWeight(action, settings.weight);
        action.stop();
        action.play();
    }

    #PrepareCrossFade(startAction, endAction, duration) {
        //if the current action is 'idleBase', execute the crossfade immediately;
        //else wait until the current action has finished its current loop
        this.ExecuteCrossFade(startAction, endAction, duration);

        if (endAction) {
            const clip = endAction.getClip();
            this.#currentBaseAction = clip.name;
        }
        else {
            this.#currentBaseAction = 'None';
        }
    }

    GetAnimMixer() {
        return this.#animationMixer;
    }

    //this function is needed, since animationAction.crossFadeTo() disables its start action and sets
    //the start actions timescale to ((start animations duration) / (end animations duration))
    ExecuteCrossFade(startAction, endAction, duration) {
        //not only the start action, but also the end action must have a weight of 1 before fading
        //for start action this is the case
        if (endAction) {
            this.#SetWeight(endAction, 1);
            endAction.time = 0;

            if (startAction) {
                //crossfade with warping
                // startAction.crossFadeTo(endAction, duration, true);
                startAction.fadeOut(0.15);
                endAction.fadeIn(0.15);
                this.#baseActions[startAction.getClip().name].weight = 0;
                this.#baseActions[endAction.getClip().name].weight = 1;
            }
            else {
                endAction.fadeIn(duration);
            }
        }
        else {
            //fade out
            startAction.fadeOut(duration);
        }
    }

    FindIsDying(){
        return this.#baseActions["death"].weight == 1;
    }

    PlayDeathAnimation() {
        if (this.#currentBaseAction == "death") return;

        this.gltfScene.rotation.y = 0;
        this.#baseActions[this.#currentBaseAction].weight = 0;
        this.#additiveActions[this.#currentAdditiveAction].weight = 0;
        this.#baseActions['death'].weight = 1;

        this.#activateAction(this.#baseActions["death"].action);
        this.#activateAction(this.#baseActions[this.#currentBaseAction].action);
        this.#activateAction(this.#additiveActions[this.#currentAdditiveAction].action);

        setTimeout(() => {
            this.#baseActions[this.#currentBaseAction].weight = 1;
            this.#additiveActions[this.#currentAdditiveAction].weight = 1;
            this.#baseActions['death'].weight = 0;

            this.#activateAction(this.#baseActions["death"].action);
            this.#activateAction(this.#baseActions[this.#currentBaseAction].action);
            this.#activateAction(this.#additiveActions[this.#currentAdditiveAction].action);
            this.#ChangeAdditiveAnimation(this.#FindLinkedBaseAnimFromAdditive(this.#currentBaseAction), true);
        }, 5000)
    }


    #FindLinkedBaseAnimFromAdditive(animName) {
        switch (animName) {
            case "idleBase":
                return "idleAdditive";
            case "walkForwardBase":
                return "walkForwardAdditive";
            case "walkBackBase":
                return "walkBackAdditive";
            case "walkLeftBase":
                return "walkLeftAdditive";
            case "walkRightBase":
                return "walkRightAdditive";
        }
    }

    //overide changes the additive action despite the one which is currently playing
    #ChangeAdditiveAnimation(animName, override = false) {
        if (this.#additiveActions[this.#currentAdditiveAction].priority <= this.#additiveActions[animName].priority && !override) return;

        const nonLoopAnim = (animName == "blockReact" || animName == "hitReactionGut" || animName == "hitReactionHead" || animName == "lightAttack" || animName == "heavyAttack");

        if (nonLoopAnim) {
            setTimeout(() => {
                console.log("anim over");
                if(animName != "blockReact"){
                    this.#ChangeAdditiveAnimation(this.#FindLinkedBaseAnimFromAdditive(this.#currentBaseAction), true);
                }
                else{
                    this.#additiveActions[this.#currentAdditiveAction].weight = 0;
                    this.#additiveActions["blockIdle"].weight = 1;
                    this.#activateAction(this.#additiveActions["blockIdle"].action);
                    this.#activateAction(this.#additiveActions[this.#currentAdditiveAction].action);
                    this.#currentAdditiveAction = "blockIdle";
                }
            }, (this.#additiveActions[animName].action._clip.duration * 1000) - 50)
        }
        this.#additiveActions[this.#currentAdditiveAction].weight = 0;
        this.#additiveActions[animName].weight = 1;
        this.#activateAction(this.#additiveActions[animName].action);
        this.#activateAction(this.#additiveActions[this.#currentAdditiveAction].action);
        this.#currentAdditiveAction = animName;
    }

    SetAnimationFromVelocities(velocities) {
        //forwardVelocity
        //sidewaysVelocity

        if (!velocities || this.FindIsDying()) {
            return;
        }

        if (this.#currentBaseAction != "idleBase" && velocities.forwardVelocity == 0 && velocities.sidewaysVelocity == 0) {
            this.#ChangeAdditiveAnimation("idleAdditive");
            this.#PrepareCrossFade(this.#baseActions[this.#currentBaseAction].action, this.#baseActions["idleBase"].action, 0);
        }

        let forwards = velocities.forwardVelocity == 1;
        let backwards = velocities.forwardVelocity == -1;
        let left = velocities.sidewaysVelocity == 1;
        let right = velocities.sidewaysVelocity == -1;

        if (forwards) {
            if (this.#currentBaseAction != "walkForwardBase") {
                this.#ChangeAdditiveAnimation("walkForwardAdditive");
                this.#PrepareCrossFade(this.#baseActions[this.#currentBaseAction].action, this.#baseActions["walkForwardBase"].action, 0.35);
            }
        }
        else if (backwards) {
            if (this.#currentBaseAction != "walkBackBase") {
                this.#ChangeAdditiveAnimation("walkBackAdditive");
                this.#PrepareCrossFade(this.#baseActions[this.#currentBaseAction].action, this.#baseActions["walkBackBase"].action, 0.35);
            }
        }
        else if (left) {
            if (this.#currentBaseAction != "walkLeftBase") {
                this.#ChangeAdditiveAnimation("idleAdditive");
                this.#PrepareCrossFade(this.#baseActions[this.#currentBaseAction].action, this.#baseActions["walkLeftBase"].action, 0.35);
            }
        }
        else if (right) {
            console.log("walk right");
            if (this.#currentBaseAction != "walkRightBase") {
                this.#ChangeAdditiveAnimation("walkRightAdditive");
                this.#PrepareCrossFade(this.#baseActions[this.#currentBaseAction].action, this.#baseActions["walkRightBase"].action, 0.35);
            }
        }
    }
}

export { GameObject };