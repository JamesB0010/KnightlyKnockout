//import * as THREE from 'three';
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js";

class PlayerAudio extends THREE.PositionalAudio{
    #attackSoundBuffers =[];
    #insultSoundBuffers = {};
    #insultBuffersLength;
    constructor(soundsToLoad, listener, soundsRootDirectory = "../GameAssets/Sounds/"){
        super(listener);
        const audioLoader = new THREE.AudioLoader();
        const insultsRootDirectory = soundsRootDirectory + "Insults/";

        let numInsults = 14;
        const insultSounds = [];
        for(let i = 1; i <= numInsults; i++){
            insultSounds.push("insult" + i + ".wav");
        }


        soundsToLoad.forEach(sound => {
            audioLoader.load(soundsRootDirectory + sound, buffer =>{
                this.#attackSoundBuffers.push(buffer);
                this.setRefDistance(0.7);
            });
        });
        let i = 0;
        insultSounds.forEach(sound =>{
            audioLoader.load(insultsRootDirectory + sound, buffer =>{
                this.#insultSoundBuffers[i] = (buffer);
                this.#insultBuffersLength = i;
                i++;
            })
        })
    }

    PlayRandomAttack(){
        let buffer = this.#attackSoundBuffers[Math.floor(Math.random()*this.#attackSoundBuffers.length)];
        this.setBuffer(buffer);
        this.setVolume(1);
        this.play();
    }

    PlayRandomInsult(index = -1){
        let randNum = Math.floor(Math.random() * this.#insultBuffersLength);
        if(index != -1){
            randNum = index;
        }
        let buffer = this.#insultSoundBuffers[randNum];
        this.setBuffer(buffer);
        this.setVolume(3);
        this.stop();
        this.play();
        return randNum;
    }
}

export {PlayerAudio}