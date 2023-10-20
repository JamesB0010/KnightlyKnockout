//credit for creating express server https://replit.com/talk/learn/SocketIO-Tutorial-What-its-for-and-how-to-use/143781


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


io.on("connection", socket => {
  console.log("someone joined with id " + socket.id);

  socket.emit('setId', socket.id);

  socket.on("playerUpdatePosition", data => {
    socket.broadcast.emit("updateNetworkedPlayerPosition", { pos: data.pos, id: data.id })
  })

  socket.on('disconnect', () => {
    console.log(socket.id + " Disconnected");
    socket.broadcast.emit("RemovePlayer", socket.id)
  })
});



server.listen(3000); // run server
console.log("server running");