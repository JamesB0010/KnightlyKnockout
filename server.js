//credit for creating express server https://replit.com/talk/learn/SocketIO-Tutorial-What-its-for-and-how-to-use/143781


const express = require("express"); // use express
const app = express(); // create instance of express
const server = require("http").Server(app); // create server
const io = require("socket.io")(server); // create instance of socketio


app.use(express.static("public")); // use "public" directory for static files


io.on("connection", socket => {
});
server.listen(3000); // run server