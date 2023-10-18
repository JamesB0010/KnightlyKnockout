import {InputController} from './InputController';
import * as THREE from 'three';

//credits https://www.youtube.com/watch?v=oqKzxPMLWxo
class FirstPersonCamera{
    constructor(camera){
        this.camera_ = camera;
        this.input_ = new InputController();
        this.rotation_ = new THREE.Quaternion();
        this.translation_ = new THREE.Vector3();
        this.phi_ = 0;
        this.theta_ - 0;
    }

    update(deltaTime){
        this.updateRotation_(deltaTime);
        this.updateCamera_(deltaTime);
    }

    updateCamera_(deltaTime){
        this.camera_.quaternion.copy(this.rotation_);
    }

    updateRotation_(deltaTime){
        const xh = this.input_.current_.mouseXDelta / window.innerWidth;
        const yh = this.input_.current_.mouseYDelta / window.innerHeight;

        this.phi_ += -xh * 5;
        this.theta_ = clamp(this.theta_ + -yh * 5 - Math.PI / 3, Math.PI / 3);

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0,1,0), this.phi_);

        const qz = new THREE.Quaternion();
        qz.setFromAxisAngle(new THREE.Vector3(1,0,0), this.theta_);

        const q = new THREE.Quaternion();
        q.multiply(qx);
        q.multiply(qz);

        this.rotation_.copy(q);
    }
}

export {FirstPersonCamera};