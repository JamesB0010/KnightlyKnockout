import serverAddress from "./serverAddress.js";
const roundCounterDom = document.getElementById("roundCounter");

const resetPositionsEvent = new CustomEvent("OnResetPositions");

class RoundManager{
    //private:
    #roundNumber;
    #maxScore;
    #playerScores;
    #clientId;
    #scoreDamageMap = {
        "0":{
          light: 25,
          heavy: 50,
          block: 10
        },
        "1":{
          light: 23,
          heavy: 45,
          block: 8,
        },
        "2":{
          light: 20,
          heavy: 40,
          block: 6
        }
      };
    constructor(clientId){
        this.#roundNumber = 1;
        this.#maxScore = 3;
        this.#playerScores = new Map();
        this.enemyScoreP = document.getElementById("enemyScoreText");
        this.clientScoreP = document.getElementById("clientScoreP");
        this.#clientId = clientId;
    }

    addKeyValToMap(key, val){
        this.#playerScores.set(key,val);
    }

    GetLightDamage(clientId){
        return this.#scoreDamageMap[this.#playerScores.get(clientId).toString()].light;
    }

    GetHeavyDamage(clientId){
        return this.#scoreDamageMap[this.#playerScores.get(clientId).toString()].heavy;
    }

    GetBlockDamage(clientId){
        return this.#scoreDamageMap[this.#playerScores.get(clientId).toString()].block;
    }
    
    #SaveStatsToServer(){
    }

    #CheckPlayerHasWon(){
        this.#playerScores.forEach((value, key) =>{
            if (value >= this.#maxScore){
                if(key == this.#clientId){
                    document.getElementsByClassName("playerWonGame")[0].style["display"] = "flex";
                    sessionStorage.setItem("gamesWon", parseInt(sessionStorage.getItem("gamesWon")) + 1);
                    sessionStorage.setItem("gamesPlayed", parseInt(sessionStorage.getItem("gamesPlayed")) + 1);
                    //console.log(sessionStorage);
                    this.#SaveStatsToServer();
                }
                else{
                    document.getElementsByClassName("playerLostGame")[0].style["display"] = "flex";
                    sessionStorage.setItem("gamesPlayed", parseInt(sessionStorage.getItem("gamesPlayed")) + 1);
                    //console.log(sessionStorage);
                    this.#SaveStatsToServer();
                }
                //alert("Player won");
                setTimeout(() =>{
                    window.location.href = "../HTML/game-over.html";
                },3000)
            }
        })
    }

    #ShowNewRoundScreen(){
        document.getElementsByClassName("newRound")[0].style["display"] = "flex";
        setTimeout(() =>{
            document.getElementsByClassName("newRound")[0].style["display"] = "none";
        }, 1100);
    }

    playerDead(Id){
        document.dispatchEvent(resetPositionsEvent);
        for (let [key, value] of this.#playerScores){
            if(key != Id){
                let newScore = this.#playerScores.get(key) + 1;
                this.#playerScores.set(key, newScore);
                /*lol*/
                if(this.#roundNumber < 5){
                    this.#roundNumber++;
                }
                roundCounterDom.innerText = "Round " + this.#roundNumber +"/5";

                if(Id != this.#clientId){
                    document.getElementsByClassName("playerWonRound")[0].style["display"] = "flex";
                    setTimeout(() =>{
                        document.getElementsByClassName("playerWonRound")[0].style["display"] = "none";
                        this.#ShowNewRoundScreen();
                    }, 800)
                    //console.log(this.clientScoreP);
                    this.clientScoreP.innerText = newScore;
                    //alert("enemy dead");
                    this.#CheckPlayerHasWon();
                    return;
                }
                else{
                    document.getElementsByClassName("playerLostRound")[0].style["display"] = "flex";
                    setTimeout(() =>{
                        document.getElementsByClassName("playerLostRound")[0].style["display"] = "none";
                        this.#ShowNewRoundScreen();
                    }, 800)
                    this.enemyScoreP.innerText = newScore;
                    //alert("Player dead" + Id);
                    this.#CheckPlayerHasWon();
                    return;
                }
            }
        }
        alert("only 1 player in game error");
    }
}

export {RoundManager};