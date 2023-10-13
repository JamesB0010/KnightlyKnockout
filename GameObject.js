import * as THREE from 'three';

class GameObject extends THREE.Mesh{
    constructor(){
        super(
            new THREE.BoxGeometry( 1, 1, 1), 
            new THREE.MeshBasicMaterial( { color: 0xffffff} )
            );
            this.castShadow = true;
    }
}

export {GameObject};