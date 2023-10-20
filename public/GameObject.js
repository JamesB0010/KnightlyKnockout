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
        color = 0xffffff,
        inputEnabled = false,
        socketId = -1,
    }){
        super(
            new THREE.BoxGeometry( width, height, depth), 
            new THREE.MeshStandardMaterial( { color} )
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
            this.grounded = false;

            this.bounciness = 0.6;

            this.socketId = socketId;
    }

    Update(){
    }
}

export {GameObject};