import * as THREE from 'three';

const gravity = -0.002;

let bloodSplatterDom = document.getElementsByClassName("bloodSplatter")[0];

//a Game object is mainly used to make the player, however can be used to make static things in the scene
//by default a game object is a cube but a gltf scene can be passed to give it a custom model

class GameObject extends THREE.Mesh{
    health = 100;
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
        gltfScene = null
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

            //if input enabled (ie, this is the local player)
            if (inputEnabled){
                this.gltfScene.children[0].visible = false;
            }

            //set the gltf scene position if its not null
            if(gltfScene){
                this.gltfScene.position.x = position.x;
                this.gltfScene.position.y = -0.78;
                this.gltfScene.position.z = position.z;
                this.gltfScene.scale.multiplyScalar(0.6);
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
}

export {GameObject};