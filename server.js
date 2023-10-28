//credit for creating express server https://replit.com/talk/learn/SocketIO-Tutorial-What-its-for-and-how-to-use/143781
//credit to https://www.youtube.com/watch?v=OKGMhFgR7RY for responding to 404 status
//credit to https://www.youtube.com/watch?v=JbwlM1Gu5aE for being able to send a html file as a response

const path = require("path");
const express = require("express"); // use express
const app = express(); // create instance of express
const server = require("http").Server(app); // create server
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "https://chat-app--coder100.repl.co", "http://localhost:3000", "http://localhost:5173"]
  }
}); // create instance of socketio


app.use(express.static("public")); // use "public" directory for static files
app.use(express.static("views"));

//configure 404 page
app.use(function(req, res, next){
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
});

let connections = [];


io.on("connection", socket => {
  //when someone joins send their socket id to the client to be saved
  console.log("someone joined with id " + socket.id);
  socket.emit('setId', socket.id);


  //add this new clients id to the connections array
  connections.push(socket.id);

//update all clients using new list of connections
  io.emit("updateConnectionsArr", connections);



  //on disconnect
  socket.on('disconnect', () => {
    console.log(socket.id + " Disconnected");
    //remove current socket from server
    connections = connections.filter(connection =>{connection != socket.id});
    io.emit("removeId", socket.id);
  })
});

server.listen(3000); // run server
console.log("server running");