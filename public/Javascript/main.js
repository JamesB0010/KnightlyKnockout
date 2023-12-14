//import * as THREE from 'three';
//credits for attack icon https://www.flaticon.com/free-icon/slash_4334055?term=attack&page=2&position=19&origin=tag&related_id=4334055
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js";
import { Particle } from "./particle.js";

import serverAddress from "./serverAddress.js";
console.log(serverAddress);

let gamePromise = import("./game.js");
gamePromise.then((promise) => {
  promise.gamePromise.then((Game) => {
    let game = new Game();
    game.Init();

    const socket = io(); // create new socket instance

    //add a game loading screen;

    //create a new game and initialise it

    let usernamesMap = new Map();
    let latestClient;

    //setup socket listeners
    //when a client joins the server a setId message will be sent to the client, they set their client id and connection array and make a new player
    socket.on("setId", info => {
      game.clientId = info.id;
      game.connectionArray.push(info.id);
      let _playerPromise = game.NewPlayer(info.id, {
        color: 0xffffff,
        inputEnabled: true,
        playerIndex: info.playerIndex,
        isClient: true
      });
      if (sessionStorage.username) {
        socket.emit("profileInfo", sessionStorage.username);
      }
      _playerPromise.then((player) => {
        console.log("player spawned");
      });
    });

    //whenever a player joins the server send the cupdateConnectionsArr message to all clients
    socket.on("updateConnectionsArr", (connections) => {
      if (connections.length == 1) {
        //only this client is connected
        return;
      }

      //if connections is different to the connection array held locally then that means a new client has joined the server
      if (connections != game.connectionArray) {
        //this line gets the id which is present in the new connections array but not in the local connection array.
        //therefore getting the new client who has joined
        let newClient = connections.filter((element) => {
          return !game.connectionArray.includes(element);
        });
        latestClient = newClient;

        //do something with this info
        console.log(game.clientId);
        console.log("new client " + newClient);
        newClient.forEach((clientId) => {
          console.log("new player");
          game.NewPlayer(clientId, {});
        });

        //update local copy of connections
        game.connectionArray = connections;
      }
    });

    socket.on("updatePlayerUsernames", (usernames) => {
      usernamesMap = new Map();
      usernames = JSON.parse(usernames);

      usernames.forEach((list) => {
        usernamesMap.set(list[0], list[1]);
      });
      try {
        fetch(
          `${serverAddress}/getProfilePicture/${usernamesMap.get(
            latestClient[0],
          )}`,
        ).then((response) => {
          response.json().then((json) => {
            console.log(json);
            if (json.error != "no user found") {
              document.getElementById("enemyProfilePicture").src =
                "data:image/png;base64," + json.profilePicture;
            }
          });
        });
      } catch {}
    });

    socket.on("UpdateNetworkedPlayerPos", (info) => {
      try{
        if (game.players.get(info.id).FindIsDying()) return;
      }
      catch{};
      //use info.id to find a player and then update its position using info.position
      game.UpdateNetworkedPlayer(info.id, info.position);
      if (game.players.get(info.id)) {
        game.players.get(info.id).SetAnimationFromVelocities(info.velocities);
      }
    });

    socket.on("NetworkedPlayerRotate", (info) => {
      try{
        if (game.players.get(info.id).FindIsDying()) return;
      }
      catch{};
      //how to isolate y axis
      //reference https://stackoverflow.com/questions/54311982/how-to-isolate-the-x-and-z-components-of-a-quaternion-rotation
      let theta_y = Math.atan2(info.rotation[1], info.rotation[3]);
      let yRotation = [0, Math.sin(theta_y), 0, Math.cos(theta_y)];
      try {
        game.players
          .get(info.id)
          .gltfScene.quaternion.set(
            yRotation[0],
            yRotation[1],
            yRotation[2],
            yRotation[3],
          );
      } catch {}
    });

    socket.on("NetworkedPlayerStoppedMoving", (id) => {
      try{
        if (game.players.get(info.id).FindIsDying()) return;
      }
      catch{};
      try {
        game.players.get(id).SetAnimationFromVelocities({
          forwardVelocity: 0,
          sidewaysVelocity: 0,
        });
      } catch {}
    });

    socket.on("GetClientPlayerIdPosition", () => {
      //try to send the player position however if the player hasnt loaded in yet just send a default position
      try {
        socket.emit("UpdatePlayerMovement", {
          position: new THREE.Vector3(game.playerRbCapsule.body.getCenterOfMassTransform().getOrigin().x(), game.playerRbCapsule.body.getCenterOfMassTransform().getOrigin().y(), game.playerRbCapsule.body.getCenterOfMassTransform().getOrigin().z()),
          id: game.clientId,
        });
      } catch {
        socket.emit("UpdatePlayerMovement", {
          position: new THREE.Vector3(0, -5, 5),
          id: game.clientId,
        });
      }
    });

    socket.on("removeId", (id) => {
      game.connectionArray = game.connectionArray.filter((connection) => {
        connection != id;
      });
      alert("enemy left returning to landing page...");
      setTimeout(()=>{
        window.location.href = serverAddress;
      }, 3000);
    });

    socket.on("NetworkedPlayerDeath", (info) => {
      game.players.get(info.id).PlayDeathAnimation();
      setTimeout(() => {
        game.roundManager.playerDead(info.id);
      }, 5000);
    });

    socket.on("ResetClientHealth", () => {
      game.player.ResetHealth();
    });

    socket.on("networkedAttack", (info) => {
      try{
        if (game.players.get(info.id).FindIsDying()) return;
      }
      catch{};
      console.log(info);
      try {
        game.players.get(info.id).children[0].PlayRandomAttack();
        game.players.get(info.id).Attack(info.attackName);
      } catch {}
    });

    socket.on("networkedStartBlock", (id) => {
      try{
        if (game.players.get(info.id).FindIsDying()) return;
      }
      catch{};
      game.players.get(id).StartBlock();
      game.players.get(id).SetIsBlocking(true);
    });

    socket.on("networkedEndBlock", (id) => {
      try{
        if (game.players.get(info.id).FindIsDying()) return;
      }
      catch{};
      game.players.get(id).EndBlock();
      game.players.get(id).SetIsBlocking(false);
    });

    socket.on("networkedPlayerInsult", (info) => {
      console.log(info.insultIndex);
      if (info.insultIndex == -1) {
        game.players.get(info.id).children[0].PlayRandomInsult();
        return;
      }
      try {
        game.players
          .get(info.id)
          .children[0].PlayRandomInsult(info.insultIndex);
      } catch {}
    });

    socket.on("NetworkedSwordHit", (damage)=>{
      try{
        if (game.player.FindIsDying()) return;
      }
      catch{};
      let playerDead = game.player.Damage(damage);
      game.particles.push(new Particle(game.player.position));
      game.scene.add(game.particles[game.particles.length -1].points);
      if (playerDead) {
        game.onClientDeath();
      }
    })

    socket.on("NetworkedBlockCollision", ()=>{
      try{
        if (game.players.get(info.id).FindIsDying()) return;
      }
      catch{};
      game.particles.push(new Particle(game.player.position, "yellow"));
      game.scene.add(game.particles[game.particles.length -1].points);
    })

    //whenever the local player moves send it to the server
    document.addEventListener("OnClientMove", (e) => {
      game.player.SetAnimationFromVelocities(e.detail);
      try {
        socket.emit("UpdatePlayerMovement", {
          position: new THREE.Vector3(game.playerRbCapsule.body.getCenterOfMassTransform().getOrigin().x(), game.playerRbCapsule.body.getCenterOfMassTransform().getOrigin().y(), game.playerRbCapsule.body.getCenterOfMassTransform().getOrigin().z()),
          id: game.clientId,
          velocities: e.detail,
        });
      } catch {}
    });

    document.addEventListener("OnClientStop", (e) => {
      game.player.SetAnimationFromVelocities({
        forwardVelocity: 0,
        sidewaysVelocity: 0,
      });
      socket.emit("clientStoppedMoving", game.clientId);
    });

    //make listener for player death
    document.addEventListener("PlayerDead", (e) => {
      game.player.PlayDeathAnimation();
      socket.emit("PlayerDeath", { id: game.clientId });
    });

    document.addEventListener("Attack", (e) => {
      game.player.Attack(e.detail.attackName);
      socket.emit("PlayerAttack", {
        id: game.clientId,
        attackName: e.detail.attackName,
      });
    });

    document.addEventListener("startBlock", (e) => {
      game.player.StartBlock();
      socket.emit("startBlock", game.clientId);
    });

    document.addEventListener("endBlock", (e) => {
      game.player.EndBlock();
      socket.emit("endBlock", game.clientId);
    });

    document.addEventListener("Insult", (e) => {
      let insultIndex = game.players
        .get(game.clientId)
        .children[0].PlayRandomInsult();
      console.log(insultIndex);
      socket.emit("PlayerInsult", {
        id: game.clientId,
        insultIndex: insultIndex,
      });
    });

    document.addEventListener("OnClientRotate", (e) => {
      let theta_y = Math.atan2(e.detail.rotation.y, e.detail.rotation.w);
      let yRotation = [0, Math.sin(theta_y), 0, Math.cos(theta_y)];
      try{
        game.player.gltfScene.quaternion.set(
              yRotation[0],
              yRotation[1],
              yRotation[2],
              yRotation[3],
            );
      }
      catch{}
      socket.emit("PlayerRotate", {
        rotation: e.detail.rotation,
        id: game.clientId,
      });
    });

    document.addEventListener("OnSwordCollision", e =>{
      console.log("sword Collision detected");
      let damage = 0;
      if(game.player.GetSWingingAnimName() == "lightAttack"){
        game.enemy.PlayHurtAnimation("lightAttack");
        damage = 25;
      }
      if(game.player.GetSWingingAnimName() == "heavyAttack"){
        game.enemy.PlayHurtAnimation("heavyAttack");
        damage = 40;
      }
      socket.emit("clientSwordCollisionWithEnemy", damage);
    })

    document.addEventListener("OnSwordBlock", e=>{
      console.log("Sword block detected");
      game.enemy.PlayBlockReactAnim();
      socket.emit("clientBlockCollision");
    })

    document.addEventListener("OnResetPositions", e =>{
      game.ResetPlayerLocation();
    });

    //game loop
    function Animate() {
      requestAnimationFrame((t) => {
        game.Update();
        Animate();
      });
    }

    Animate();

    if (sessionStorage.username) {
      document.getElementById("clientProfilePicture").src =
        `data:image/png;base64,${sessionStorage.profilePicture}`;
      console.log(sessionStorage);
    }
  });
});
