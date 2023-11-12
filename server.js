//credit for creating express server https://replit.com/talk/learn/SocketIO-Tutorial-What-its-for-and-how-to-use/143781
//credit to https://www.youtube.com/watch?v=OKGMhFgR7RY for responding to 404 status
//credit to https://www.youtube.com/watch?v=JbwlM1Gu5aE for being able to send a html file as a response

//this is the server that serves all the game files and runs the networking of the game

const path = require("path");
const express = require("express"); // use express
const app = express(); // create instance of express
const server = require("http").Server(app); // create server
const io = require("socket.io")(server, {
  cors: {
    //list trusted sources
    origin: [
      "https://chat-app--coder100.repl.co", "http://localhost:3000", "http://localhost:5173"]
  }
}); // create instance of socketio

//setting the directiories which we will serve to the client (static files)
app.use(express.static("public/HTML"));
app.use(express.static("public/CSS")); 
app.use(express.static("public/Javascript")); 
app.use(express.static("public"));
app.use(express.static("public/GameAssets"));
app.use(express.static("public/GameAssets/SkyboxTextures"));
app.use(express.static("public/GameAssets/Models"));
app.use(express.static("public/GameAssets/Models/Environment"));
app.use(express.static("public/GameAssets/Models/Player"));
app.use(express.static("views"));

//configure 404 page
app.use(function(req, res, next){
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
});

//connections holds the socket id's of all clients connected to the server
//this is the objectivley correct, which will be sent to clients to update their local lists
let connections = [];


io.on("connection", socket => {
  //when someone joins send their socket id to the client to be saved
  console.log("someone joined with id " + socket.id);
  socket.emit('setId', socket.id);


  //add this new clients id to the connections array
  connections.push(socket.id);

//update all clients using new list of connections
  io.emit("updateConnectionsArr", connections);

  //make every client send an update player movement to set all of the clients networked players (other player) to the correct position
  io.emit("GetClientPlayerIdPosition");

//whenever a player moves their new position and id inside the info object will be sent to all clients except from the sender
  socket.on("UpdatePlayerMovement", info =>{
    socket.broadcast.emit("UpdateNetworkedPlayerPos", info);
  })

  socket.on("clientStoppedMoving", id =>{
    socket.broadcast.emit("NetworkedPlayerStoppedMoving", id);
  })

  socket.on("PlayerLightAttack", id =>{
    socket.broadcast.emit("networkedLightAttack", id);
  })

  socket.on("PlayerHeavyAttack", id =>{
    socket.broadcast.emit("networkedHeavyAttack", id);
  })

  socket.on("PlayerDeath", info =>{
    socket.broadcast.emit("NetworkedPlayerDeath", info);
    socket.emit("ResetClientHealth");
    socket.broadcast.emit("ResetClientHealth");
  })

  //on disconnect
  socket.on('disconnect', () => {
    console.log(socket.id + " Disconnected");
    //remove current socket from server
    connections = connections.filter(connection =>{connection != socket.id});
    io.emit("removeId", socket.id);
  })
});

server.listen(3000); // run server
console.log("server running on http://localhost:3000");