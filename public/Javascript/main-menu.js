import serverAddress from "./serverAddress.js";


let createGameButton = document.getElementById("createGameButton");
let gameNameInputField = document.getElementById("GameName");
let serverListDiv = document.getElementById("serverListDiv");

function ClearGameNames() {
  serverListDiv.innerHTML = '';
}

function DisplayGames(gamesMap) {
  ClearGameNames();
  let i = 0;
  for (const [key, value] of Object.entries(gamesMap)) {
    serverListDiv.innerHTML += `<div id = ${key} class = 'GameEntryDiv'></div>`;
    serverListDiv.children[i].innerHTML += `<p>${key}</p>`;
    serverListDiv.children[i].innerHTML += `<p>|</p>`;
    serverListDiv.children[i].innerHTML += `<p>Game Mode: ${value.gameMode}</p>`;
    serverListDiv.children[i].innerHTML += `<p>|</p>`;
    serverListDiv.children[i].innerHTML += `<p>Players in Game: ${value.playersInGame}</p>`;
    serverListDiv.children[i].innerHTML += `<p>|</p>`;
    serverListDiv.children[i].innerHTML += `<button onclick = 'window.location.href = "./game.html";'>Join Game</button>`;
    i++;
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
  socket.emit("CreateNewGame", gameNameInputField.value);
})

socket.on("updateLobbyList", lobbyList => {
  console.log(lobbyList);
  DisplayGames(lobbyList);
})

