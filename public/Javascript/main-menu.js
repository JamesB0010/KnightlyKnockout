import serverAddress from "./serverAddress.js";


let createGameButton = document.getElementById("createGameButton");
let gameNameInputField = document.getElementById("GameName");
let serverListDiv = document.getElementById("serverListDiv");

let GamesMap = {};

function ClearGameNames() {
  serverListDiv.innerHTML = '';
}

function DisplayGames(gamesMap) {
  ClearGameNames();
  GamesMap = gamesMap;
  let i = 0;
  for (const [key, value] of Object.entries(gamesMap)) {
    serverListDiv.innerHTML += `<div id = ${key} class = 'GameEntryDiv'></div>`;
    serverListDiv.children[i].innerHTML += `<p>${key}</p>`;
    serverListDiv.children[i].innerHTML += `<p>|</p>`;
    serverListDiv.children[i].innerHTML += `<p>Game Mode: ${value.gameMode}</p>`;
    serverListDiv.children[i].innerHTML += `<p>|</p>`;
    serverListDiv.children[i].innerHTML += `<p>Players in Game: ${value.playersInGame}</p>`;
    serverListDiv.children[i].innerHTML += `<p>|</p>`;
    serverListDiv.children[i].innerHTML += `<button class = "joinGameButton">Join Game</button>`;
    i++;
    
    Array.from(document.getElementsByClassName("joinGameButton")).forEach(button => {
      button.addEventListener("click", ()=>{
        socket.emit("joiningGame", key);
      })
    });
  }
}

//detect enter key input for input field https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field
gameNameInputField.addEventListener("keyup", (e) => {
  if (e.key === 'Enter' || e.keyCode === 13) {
    socket.emit("CreateNewGame", gameNameInputField.value);
  }
})

const socket = io(`${serverAddress}/Lobby`);

createGameButton.addEventListener("click", e => {
  if(GamesMap[gameNameInputField.value]){
    alert("Error game already exists");
    return;
  }
  socket.emit("CreateNewGame", gameNameInputField.value);
})

socket.on("updateLobbyList", lobbyList => {
  console.log(lobbyList);
  DisplayGames(lobbyList);
})

let lobbyIdIsStored = false;
sessionStorage.removeItem("lobbyId");
socket.on("lobbyId", lobbyId=>{
  try{
    sessionStorage.setItem("lobbyId", lobbyId);
    lobbyIdIsStored = true;
  }
  catch{
    alert("something went wrong with the session storage :(");
  }
});


socket.on("permissionToJoinGameGranted", ()=>{
  if(lobbyIdIsStored){
    window.location.href = "./game.html";
  }
})

socket.on("permissionToJoinGameRejected", ()=>{
  alert("Your request to join a game was rejected, this may be bacuase the lobby is already full");
})
