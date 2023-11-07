
class RoundManager{
    //private:
    #roundNumber;
    #maxScore;
    #playerScores;
    constructor(){
        this.#roundNumber = 0;
        this.#maxScore = 3;
        this.#playerScores = [0,0];
    }
}

export {RoundManager};