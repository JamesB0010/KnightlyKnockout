import * as THREE from 'three';

class PlayerAudio extends THREE.PositionalAudio{
    #attackSoundBuffers =[];
    #insultSoundBuffers = [];
    constructor(soundsToLoad, listener, soundsRootDirectory = "../GameAssets/Sounds/"){
        super(listener);
        const audioLoader = new THREE.AudioLoader();
        const insultsRootDirectory = soundsRootDirectory + "Insults/";
        const insultSounds = ["insult1.wav", "insult2.wav", "insult3.wav", "insult4.wav", "insult5.wav"];
        soundsToLoad.forEach(sound => {
            audioLoader.load(soundsRootDirectory + sound, buffer =>{
                this.#attackSoundBuffers.push(buffer);
                this.setRefDistance(0.6);
            });
        });
        insultSounds.forEach(sound =>{
            audioLoader.load(insultsRootDirectory + sound, buffer =>{
                this.#insultSoundBuffers.push(buffer);
            })
        })
    }

    PlayRandomAttack(){
        let buffer = this.#attackSoundBuffers[Math.floor(Math.random()*this.#attackSoundBuffers.length)];
        this.setBuffer(buffer);
        this.play();
    }

    PlayRandomInsult(index = -1){
        let randNum = Math.floor(Math.random() * this.#insultSoundBuffers.length);
        if(index != -1){
            randNum = index;
        }
        let buffer = this.#insultSoundBuffers[randNum];
        this.setBuffer(buffer);
        this.play();
        return randNum;
    }
}

export {PlayerAudio}