
class RoundManager{
    //private:
    #roundNumber;
    #maxScore;
    #playerScores;
    constructor(){
        this.#roundNumber = 0;
        this.#maxScore = 3;
        this.#playerScores = new Map();
    }

    addKeyValToMap(key, val){
        this.#playerScores.set(key,val);
    }

    playerDead(Id){
        for (let [key, value] of this.#playerScores){
            if(key != Id){
                this.#playerScores.set(key, this.#playerScores.get(key) + 1);
                console.log(this.#playerScores);
            }
        }
    }
}

export {RoundManager};