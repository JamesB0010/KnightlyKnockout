import * as THREE from 'three';

const gravity = -0.002;

class GameObject extends THREE.Mesh{
    constructor({
        height = 1,
        width = 1,
        depth = 1,
        position = {
            x: 0,
            y: 0,
            z: 0
        },
        gravityEnabled = false
    }){
        super(
            new THREE.BoxGeometry( width, height, depth), 
            new THREE.MeshStandardMaterial( { color: 0xffffff} )
            );
            this.castShadow = true;
            this.position.x = position.x;
            this.position.y = position.y;
            this.position.z = position.z;
            this.castShadow = true;
            this.receiveShadow = true;
            this.height = height;
            this.width = width;
            this.depth = depth;

            this.velocity = {
                x: 0,
                y: 0,
                z: 0
            };
            this.gravityEnabled = gravityEnabled;
            this.grounded = false;

            this.bounciness = 0.6;
    }

    GetTopOfCube(){
        return this.position.y + this.height / 2;
    }
    GetBottomOfCube(){
        return this.position.y - this.height / 2;
    }
    GetLeftOfCube(){
        return this.position.x - this.width / 2;
    }
    GetRightOfCube(){
        return this.position.x + this.width / 2;
    }
    GetFrontOfCube(){
        return this.position.z + this.depth / 2;
    }
    GetBackOfCube(){
        return this.position.z + this.depth / 2;
    }
    ApplyGravity(){
        this.velocity.y += gravity;

        if(this.position.y + this.velocity.y <= -0.25){
            this.velocity.y *= this.bounciness;
            this.velocity.y *= -1;
        }
        else{
            this.position.y += this.velocity.y;
        }
    }

    Update(){
        if(!this.gravityEnabled){
            return;
        }

        this.ApplyGravity();
    }
}

export {GameObject};