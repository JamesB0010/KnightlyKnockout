//credit for creating express server https://replit.com/talk/learn/SocketIO-Tutorial-What-its-for-and-how-to-use/143781
//credit to https://www.youtube.com/watch?v=OKGMhFgR7RY for responding to 404 status
//credit to https://www.youtube.com/watch?v=JbwlM1Gu5aE for being able to send a html file as a response
//how to use multer https://www.youtube.com/watch?v=EVOFt8Its6I

//this is the server that serves all the game files and runs the networking of the game

const crypto = require('crypto');
const cors = require('cors');
const path = require("path");
const express = require("express"); // use express
const app = express(); // create instance of express
const server = require("http").Server(app); // create server
const io = require("socket.io")(server, {
  cors: {
    //list trusted sources
    origin: [
      "https://year2uniwebgame.jamesbland.repl.co", "http://localhost:3000", "http://localhost:5173"]
  }
}); // create instance of socketio


//import sql library
const mySql = require('mysql');

//using multer
const multer = require('multer');

const fs = require('fs');

let Games = new Map();


//this commented out bit is for actually storing these images on the disk inside an images folder inside the project folder
//so if you re enable these comments make sure there is an images folder in the project
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname);
  }
})

const upload = multer({
  storage: fileStorageEngine
});

const database = mySql.createConnection({
  host: "sql8.freemysqlhosting.net",
  user: "sql8666464",
  password: "es8gRGJxQN",
  database: "sql8666464"
  // host: "localhost",
  // user:"root",
  // password: "",
  // database: "knightlyknockout"
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

app.use(cors());

//how to get a list of all files in a directory
let backgroundSongs;

fs.promises.readdir("./ServerRescources/Sounds/BackgroundMusic").then((files) =>{
  backgroundSongs = files;
})


app.get("/randomSong", (req, res) => {
  let randomIndex = Math.floor(Math.random() * (backgroundSongs.length));
  let song = fs.readFileSync("./ServerRescources/Sounds/BackgroundMusic/" + backgroundSongs[randomIndex]);
  res.send({song: song.toString('base64')});
})

//database stuff
app.get("/getUser/:username/:password", (req, res) => {
  let password = crypto.createHash('md5').update(req.params.password).digest('hex');
  let sql = `SELECT * FROM users WHERE username = '${req.params.username}' AND password = '${password}'`;
  database.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length != 0) {
      fs.readFile(path.join(__dirname, "images", result[0].profilePicture), function read(err, data) {
        if (err) {
          throw err;
        }
        res.send({ body: "Logged in!", profilePicture: data.toString('base64'), gamesPlayed:result[0].gamesPlayed, gamesWon: result[0].gamesWon });

      })
    }
    else {
      res.send({ error: "no user found" });
    }
  })
});

app.get("/getProfilePicture/:username", (req, res) => {
  let sql = `SELECT * FROM users WHERE username = '${req.params.username}'`;
  database.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length != 0) {
      fs.readFile(path.join(__dirname, "images", result[0].profilePicture), function read(err, data) {
        if (err) {
          throw err;
        }
        res.send({ profilePicture: data.toString('base64') });
      })
    }
    else {
      res.send({ error: "no user found" });
    }
  })
})

//how to hash a string https://stackoverflow.com/questions/5878682/node-js-hash-string
app.post("/newUser", upload.array('image', 3), (req, res) => {
  let username = req.body.image[0];
  let password = req.body.image[1];
  password = crypto.createHash('md5').update(password).digest('hex');
  let profilePic = req.files[0];
  let profilePicFileName = profilePic.filename;

  let userExists = false;

  let check = `SELECT * FROM users WHERE username = '${username}'`;

  database.query(check, (err, result) => {
    if (result.length > 0) {
      res.send({ body: "user already exists" });
      fs.unlink(path.join(__dirname, "images", profilePicFileName), err => {
        if (err) throw err;
      })
      return;
    }

    if (profilePic.originalname == "default.png") {
      fs.unlink(path.join(__dirname, "images", profilePicFileName), err => {
        if (err) throw err;
      })
      profilePicFileName = "default.png";
    }

    let post = { username: username, password: password, profilePicture: profilePicFileName };
    let sql = "INSERT INTO users SET ?"
    database.query(sql, post, (err, result) => {
    })
    res.send({ body: "user created sucessfully" });
  })

})

app.put("/updateScore/:username/:password/:gamesPlayed/:gamesWon", (req, res) =>{
  let password = crypto.createHash('md5').update(req.params.password).digest('hex');
  let sql = `UPDATE users SET gamesPlayed = '${req.params.gamesPlayed}', gamesWon = '${req.params.gamesWon}' WHERE username = '${req.params.username}' AND password = '${password}'`;
  database.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length != 0) {
      res.send({body: "user score updated"});
    }
    else {
      res.send({ error: "no user found" });
    }
  })
})

//configure 404 page
app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
});

//connections holds the socket id's of all clients connected to the server
//this is the objectivley correct, which will be sent to clients to update their local lists
let connections = [];
let playerUsernames = new Map();


io.on("connection", socket => {

  //when someone joins send their socket id to the client to be saved
  console.log("someone joined with id " + socket.id);
  socket.emit('setId', {id: socket.id, playerIndex: connections.length});
  io.emit("updatePlayerUsernames", JSON.stringify([...playerUsernames]));

  //add this new clients id to the connections array
  connections.push(socket.id);
  //update all clients using new list of connections
  io.emit("updateConnectionsArr", connections);

  socket.on("profileInfo", username => {
    playerUsernames.set(socket.id, username);
    io.emit("updatePlayerUsernames", JSON.stringify([...playerUsernames]));
    console.log(playerUsernames);
  })


  socket.on("PlayerRotate", info => {
    socket.broadcast.emit("NetworkedPlayerRotate", info);
  })

  socket.on("clientSwordCollisionWithEnemy", (damage)=>{
    socket.broadcast.emit("NetworkedSwordHit", damage);
  })

  socket.on("clientBlockCollision", ()=>{
    socket.broadcast.emit("NetworkedBlockCollision");
  })



  //make every client send an update player movement to set all of the clients networked players (other player) to the correct position
  io.emit("GetClientPlayerIdPosition");

  //whenever a player moves their new position and id inside the info object will be sent to all clients except from the sender
  socket.on("UpdatePlayerMovement", info => {
    socket.broadcast.emit("UpdateNetworkedPlayerPos", info);
  })

  socket.on("clientStoppedMoving", id => {
    socket.broadcast.emit("NetworkedPlayerStoppedMoving", id);
  })

  socket.on("PlayerAttack", info => {
    socket.broadcast.emit("networkedAttack", info);
  })

  socket.on("startBlock", id => {
    socket.broadcast.emit("networkedStartBlock", id);
  })

  socket.on("endBlock", id => {
    socket.broadcast.emit("networkedEndBlock", id);
  })

  socket.on("PlayerInsult", (info) => {
    socket.broadcast.emit("networkedPlayerInsult", info);
  })

  socket.on("PlayerDeath", info => {
    socket.broadcast.emit("NetworkedPlayerDeath", info);
    socket.emit("ResetClientHealth");
    socket.broadcast.emit("ResetClientHealth");
  })

  //on disconnect
  socket.on('disconnect', () => {
    console.log(socket.id + " Disconnected");
    //remove current socket from server
    connections = connections.filter(connection => { connection != socket.id });
    io.emit("removeId", socket.id);
    playerUsernames.delete(socket.id);
  })
});


//---------Lobby namespace
const lobby = io.of("/Lobby");

lobby.on("connection", socket =>{
  console.log("someone connected to the lobby");
  socket.emit("updateLobbyList", Object.fromEntries(Games));


  socket.on("CreateNewGame", gameName =>{
    Games.set(gameName, {gameMode: "1v1", playersInGame: "0/2"});
    lobby.emit("updateLobbyList", Object.fromEntries(Games));
  })

  socket.on('disconnect', ()=>{
    console.log("someone dissconnected from the lobby");
  })
})






server.listen(3000); // run server
console.log("server running on http://localhost:3000");