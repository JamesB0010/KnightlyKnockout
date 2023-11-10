import * as THREE from 'three';

class PlayerAudio extends THREE.PositionalAudio{
    #attackSoundBuffers =[];
    constructor(soundsToLoad, listener, soundsRootDirectory = "../GameAssets/Sounds/"){
        super(listener);
        const audioLoader = new THREE.AudioLoader();
        soundsToLoad.forEach(sound => {
            audioLoader.load(soundsRootDirectory + sound, buffer =>{
                this.#attackSoundBuffers.push(buffer);
                this.setRefDistance(20);
            });
        });
    }

    PlayRandomAttack(){
        let buffer = this.#attackSoundBuffers[Math.floor(Math.random()*this.#attackSoundBuffers.length)];
        this.setBuffer(buffer);
        this.play();
    }
}

export {PlayerAudio}