
class RoundManager{
    //private:
    #roundNumber;
    #maxScore;
    #playerScores;
    constructor(){
        this.#roundNumber = 0;
        this.#maxScore = 3;
        this.#playerScores = new Map();
        this.enemyScoreP = document.getElementById("enemyScoreText");
    }

    addKeyValToMap(key, val){
        this.#playerScores.set(key,val);
    }

    #CheckPlayerHasWon(){
        this.#playerScores.forEach((value, key) =>{
            if (value >= this.#maxScore){
                alert("Player won");
            }
        })
    }

    playerDead(Id){
        for (let [key, value] of this.#playerScores){
            if(key != Id){
                let newScore = this.#playerScores.get(key) + 1;
                this.#playerScores.set(key, newScore);
                this.enemyScoreP.innerText = newScore;
                alert("Player dead" + Id);
                this.#CheckPlayerHasWon();
                return;
            }
        }
        alert("only 1 player in game error");
    }
}

export {RoundManager};