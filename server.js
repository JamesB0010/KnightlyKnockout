//credit for creating express server https://replit.com/talk/learn/SocketIO-Tutorial-What-its-for-and-how-to-use/143781
//credit to https://www.youtube.com/watch?v=OKGMhFgR7RY for responding to 404 status
//credit to https://www.youtube.com/watch?v=JbwlM1Gu5aE for being able to send a html file as a response
//how to use multer https://www.youtube.com/watch?v=EVOFt8Its6I

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


//import sql library
const mySql = require('mysql');

//using multer
const multer = require('multer');

const fs = require('fs');


//this commented out bit is for actually storing these images on the disk inside an images folder inside the project folder
//so if you re enable these comments make sure there is an images folder in the project
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, './images');
  },
  filename: (req, file, cb) =>{
    cb(null, Date.now() + '--' + file.originalname);
  }
})

const upload = multer({
  storage: fileStorageEngine
});

const database = mySql.createConnection({
  host: "localhost",
  user:"root",
  password: "",
  database: "knightlyknockout"
})

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

//database stuff
app.get("/getUser/:username/:password", (req, res) =>{
  let sql = `SELECT * FROM users WHERE username = '${req.params.username}' AND password = '${req.params.password}'`;
  database.query(sql, (err, result) =>{
    if (err) throw err;
    if(result.length != 0){
      fs.readFile(path.join(__dirname, "images", result[0].profilePicture), function read(err, data){
        if(err){
          throw err;
        }
        res.send({body: "Logged in!", profilePicture: data.toString('base64')});

      })
    }
    else{
      res.send({error: "no user found"});
    }
  })
});

app.post("/newUser", upload.array('image', 3), (req, res) =>{
  let username = req.body.image[0];
  let password = req.body.image[1];
  let profilePic = req.files[0];
  let profilePicFileName = profilePic.filename;

  let userExists = false;

  let check = `SELECT * FROM users WHERE username = '${username}'`;

  database.query(check, (err, result)=>{
    if (result.length > 0){
      res.send({body: "user already exists"});
      fs.unlink(path.join(__dirname, "images", profilePicFileName), err =>{
        if (err) throw err;
      })
      return;
    }

    if(profilePic.originalname == "default.png"){
      fs.unlink(path.join(__dirname, "images", profilePicFileName), err =>{
        if (err) throw err;
      })
      profilePicFileName = "default.png";
    }

    let post = {username: username, password: password, profilePicture: profilePicFileName};
    let sql = "INSERT INTO users SET ?"
    database.query(sql, post, (err, result) =>{
    })
    res.send({body: "user created sucessfully"});
  })

})

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

  socket.on("PlayerAttack", info =>{
    socket.broadcast.emit("networkedAttack", info);
  })

  socket.on("startBlock", id =>{
    socket.broadcast.emit("networkedStartBlock", id);
  })

  socket.on("endBlock", id =>{
    socket.broadcast.emit("networkedEndBlock", id);
  })

  socket.on("PlayerInsult", (info) =>{
    socket.broadcast.emit("networkedPlayerInsult", info);
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