//import * as THREE from 'three';
import * as THREE from 'three';

//Randomize matrix function from three js github https://github.com/mrdoob/three.js/blob/dev/examples/webgl_instancing_performance.html

const randomizeMatrix = function () {
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function ( matrix ) {
        position.x = Math.random() * 6.5 - 3.25;
        position.y = 15;
        position.z = Math.random() * 6.5 - 3.5;

        quaternion.random();

        scale.x = scale.y = scale.z = 1;

        matrix.compose( position, quaternion, scale );
    };
}();

class Cloud{
    static #SpawnRandomCloud(){
        const matrix = new THREE.Matrix4();
        const geometry = new THREE.SphereGeometry(2,5,6);
        const material = new THREE.MeshLambertMaterial({color: 0xffffff});
	    const mesh = new THREE.InstancedMesh( geometry, material, 6 );

		for ( let i = 0; i < 6; i ++ ) {

			randomizeMatrix( matrix );
			mesh.setMatrixAt( i, matrix );

		}

        return mesh;
    }
    static CreateCloud(){
        return this.#SpawnRandomCloud();
    }
}

export {Cloud};