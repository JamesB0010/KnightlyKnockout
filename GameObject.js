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
        gravityEnabled = false,
        color = 0xffffff,
        inputEnabled = false
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
            this.gravityEnabled = gravityEnabled;
            this.grounded = false;

            this.bounciness = 0.6;
    }
    SetupInput({
        keyUp = {
            forwards: () =>{
                console.log("Up Forwards Default");
            },
            backwards: () =>{
                console.log("Up Backwards Default")
            },
            left: () =>{
                console.log("Up left Default");
            },
            right: ()=>{
                console.log("Up right Default");
            }
        },
        keyDown = {
            forwards: () =>{
                console.log("Down Forwards Default");
            },
            backwards: () =>{
                console.log("Down Backwards Default")
            },
            left: () =>{
                console.log("Down left Default");
            },
            right: ()=>{
                console.log("Down right Default");
            }
        }
    }){
        window.addEventListener("keydown", e => {
            switch (e.code){
                case "KeyW":
                    keyDown.forwards();
                    break;
                case "KeyS":
                    keyDown.backwards();
                    break;
                case "KeyA":
                    keyDown.left();
                    break;
                case "KeyD":
                    keyDown.right();
                    break;
            }
        })

        window.addEventListener("keyup", e =>{
            switch (e.code){
                case "KeyW":
                    keyUp.forwards();
                    break;
                case "KeyS":
                    keyUp.backwards();
                    break;
                case "KeyA":
                    keyUp.left();
                    break;
                case "KeyD":
                    keyUp.right();
                    break;
            }
        })
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

    ApplyXVelocity(){
        this.position.x += this.velocity.x;
    };

    ApplyZVelocity(){
        this.position.z += this.velocity.z;
    };

    Update(){
        if(this.gravityEnabled){
            this.ApplyGravity();
        }
        this.ApplyXVelocity();
        this.ApplyZVelocity();
    }
}

export {GameObject};