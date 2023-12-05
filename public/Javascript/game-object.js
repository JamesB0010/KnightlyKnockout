import * as THREE from 'three';

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
        idleBase: { weight: 0 },
        walkForwardBase: { weight: 1 },
        walkBackBase: { weight: 0 },
        walkLeftBase: { weight: 0 },
        walkRightBase: { weight: 0 },
        death: { weight: 0 }
    }

    #additiveActions = {
        blockIdle: { weight: 0 },
        blockReact: { weight: 0 },
        hitReactionGut: { weight: 0 },
        hitReactionHead: { weight: 0 },
        lightAttack: { weight: 0 },
        heavyAttack: { weight: 0 },
        walkForwardAdditive: { weight: 1 },
        idleAdditive: { weight: 0 },
        walkBackAdditive: { weight: 0 },
        walkLeftAdditive: { weight: 0 },
        walkRightAdditive: { weight: 0 }
    }

    #currentAdditiveAction = "walkForwardAdditive";
    #currentBaseAction = "walkForwardBase";
    #numAnimations;
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
            this.#model.children[0].visible = false;
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
            const animations = gltfFile.animations;
            
            this.#animationMixer = new THREE.AnimationMixer(gltfScene);

            this.#numAnimations = animations.length;

            for (let i = 0; i != this.#numAnimations; i++){
                let clip = animations[i];
                const name = clip.name;

                if(this.#baseActions[name]){
                    const action = this.#animationMixer.clipAction(clip);
                    this.#activateAction(action);
                    this.#baseActions[name].action = action;
                    this.#allActions.push(action);
                }
                else if(this.#additiveActions[name]){
                    //make the clip additive
                    THREE.AnimationUtils.makeClipAdditive(clip, 0, this.#baseActions["walkForwardBase"].action.getClip());

                    const action = this.#animationMixer.clipAction(clip);
                    this.#activateAction(action);
                    this.#additiveActions[name].action = action;
                    this.#allActions.push(action);
                }
            }

            //load the "right walk" animation as for some reason was not able to include it in the main knight glb file
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

    UpdateAnimMixer(deltaTime){
        this.#animationMixer.update(deltaTime);
        this.#leftFoot.rotation.order = "YZX";
        this.#leftFoot.rotation.x -= 0.27 * Math.PI;
        this.#leftFoot.children[0].rotation.order = "YZX";
        this.#leftFoot.children[0].rotation.x += 0.1 * Math.PI;
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

        if (currentBaseAction === 'idleBase' || !startAction || !endAction) {
            executeCrossFade(startAction, endAction, duration);
        }
        else {
            synchronizeCrossFade(startAction, endAction, duration);
        }

        if (endAction) {
            const clip = endAction.getClip();
            currentBaseAction = clip.name;
        }
        else {
            currentBaseAction = 'None';
        }
    }

    #SynchroniseCrossFade(startAction, endAction, duration) {
        mixer.addEventListener('loop', onLoopFinished);

        function onLoopFinished(event) {
            if (event.action == startAction) {
                mixer.removeEventListener('loop', onLoopFinished);

                executeCrossFade(startAction, endAction, duration);
            }
        }
    }

    //this function is needed, since animationAction.crossFadeTo() disables its start action and sets
    //the start actions timescale to ((start animations duration) / (end animations duration))
    #ExecuteCrossFade(startAction, endAction, duration) {
        //not only the start action, but also the end action must have a weight of 1 before fading
        //for start action this is the case
        if (endAction) {
            setWeight(endAction, 1);
            endAction.time = 0;

            if (startAction) {
                //crossfade with warping
                startAction.crossFadeTo(endAction, duration, true);
                baseActions[startAction.getClip().name].weight = 0;
                baseActions[endAction.getClip().name].weight = 1;
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

    #PlayDeathAnimation(){

    }
}

export { GameObject };