import * as THREE from 'three';

const gravity = -0.002;

let bloodSplatterDom = document.getElementsByClassName("bloodSplatter")[0];

//a Game object is mainly used to make the player, however can be used to make static things in the scene
//by default a game object is a cube but a gltf scene can be passed to give it a custom model

class GameObject extends THREE.Mesh{
    health = 100;
    #animationMixer;
    #currentAnimation = 1;
    #animActions = [];
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
        Geometry = new THREE.BoxGeometry(0, 0,0),
        Material = new THREE.MeshStandardMaterial({color: 0xffffff}),
        scale = 1,
        gltfScene = null,
        gltfFile = null
    }){
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
            this.scale.set(scale,scale,scale);

            //if a gltf scene is passed this wont be null
            this.gltfScene = gltfScene;
            this.gltfFile = gltfFile;

            //if input enabled (ie, this is the local player)
            if (inputEnabled){
                this.gltfScene.children[0].visible = false;
                document.addEventListener("lightAttack", () =>{
                    this.children[0].PlayRandomAttack();
                });
                document.addEventListener("HeavyAttack", () =>{
                    this.children[0].PlayRandomAttack();
                })
            }

            //set the gltf scene position if its not null
            if(gltfScene){
                this.gltfScene.position.x = position.x;
                this.gltfScene.position.y = -0.78;
                this.gltfScene.position.z = position.z;
                this.gltfScene.scale.multiplyScalar(0.6);
                this.#animationMixer = new THREE.AnimationMixer(gltfScene)
                for(let i = 0; i < this.gltfFile.animations.length; i++){
                    this.#animActions.push(this.#animationMixer.clipAction(this.gltfFile.animations[i]));
                }
                this.#animActions[this.#currentAnimation].play();
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
    updateGltfPosition(){
        this.gltfScene.position.x = this.position.x;
        this.gltfScene.position.z = this.position.z;
    }

    SetAnimation(index){
        if(this.#currentAnimation == index){
            return;
        }
        if(index == 2){
            //1800 is the time in milliseconds it takes to do the light attack animation
            setTimeout(() =>{
                this.SetAnimation(1);
            }, 1000);
        };
        if(index == 0){
            //2230 is the time in milliseconds it takes to do the light attack animation
            setTimeout(() =>{
                this.SetAnimation(1);
            }, 1800);
        };
        //credits https://discourse.threejs.org/t/how-to-not-reset-model-position-when-crossfading-animations/27490, https://github.com/mrdoob/three.js/blob/d39d82999f0ac5cdd1b4eb9f4aba3f9626f32ab6/examples/webgl_animation_skinning_morph.html#L214-L232
        let prevAction = this.#animActions[this.#currentAnimation];
        let activeAction = this.#animActions[index];
        this.#currentAnimation = index;

        if(prevAction !== activeAction){
            prevAction.fadeOut(0.5);
        }

        activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.5).play();
    }

    SetAnimationFromVelocities(velocities){
        //player isnt moving edge case;
        if(velocities.forwardVelocity == 0 && velocities.sidewaysVelocity == 0){
            this.SetAnimation(1);
            return;
        }
        if(velocities.sidewaysVelocity == 1){
            this.SetAnimation(6);
            return;
        }
        if(velocities.sidewaysVelocity == -1){
            this.SetAnimation(5);
            return;
        }
        if(velocities.forwardVelocity == 1){
            this.SetAnimation(3);
            return;
        }
        if(velocities.forwardVelocity == -1){
            this.SetAnimation(4);
            return;
        }
    }

    UpdateAnimMixer(deltaTime){
        this.#animationMixer.update(deltaTime);
    }

    UpdateBloodSpatterOpacity(){
        bloodSplatterDom.style["opacity"] = 1 - this.health / 100;
    }

    Heal(amount){
        if(this.health == 0){
            return;
        }
        if (this.health < 100){
            this.health += amount;
            console.log(this.health);
            this.UpdateBloodSpatterOpacity();
        }
    }
    Damage(amount){
        //return true if this damage caused the player to die
        if(this.health > 0){
            this.health -= amount;
            console.log(this.health);
            this.UpdateBloodSpatterOpacity();
        }
        if (this.health <= 0){
            //player has died
            console.log("player has died");
            return true;
        }
        else{
            return false;
        }
    }

    ResetHealth(){
        this.health = 100;
        this.UpdateBloodSpatterOpacity();
    }
}

export {GameObject};