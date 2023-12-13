//how to respond to form submit with js https://www.freecodecamp.org/news/how-to-submit-a-form-with-javascript/#:~:text=To%20submit%20a%20form%20using,if%20any%20data%20is%20submitted).
import serverAddress from "./serverAddress.js";

let profilePicDiv = document.getElementById("profilePicture");
let gamesPlayedText = document.getElementById("gamesplayed");
let gamesWonText = document.getElementById("gamesWon");


let form = document.getElementsByTagName("form")[0];

form.addEventListener("submit", e =>{
    e.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch(`${serverAddress}/getUser/${username}/${password}`).then(res =>{
        res.json().then(json =>{
            if(json.error){
                alert("user not found");
                return;
            }
            profilePicDiv.style.backgroundImage = `url(data:image/png;base64,${json.profilePicture})`;
            gamesPlayedText.innerText = `Games Played: ${json.gamesPlayed}`;
            gamesWonText.innerText = `Games Won: ${json.gamesWon}`;

            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
            sessionStorage.setItem("profilePicture", json.profilePicture);
            sessionStorage.setItem("gamesPlayed", parseInt(json.gamesPlayed));
            sessionStorage.setItem("gamesWon", parseInt(json.gamesWon));
            setTimeout(() => {
                alert(json.body);
            }, 200);
        })
    })
})

if(sessionStorage.username){
    setTimeout(() =>{
        alert(`Hi ${sessionStorage.username} your user credentials have been remembered from the last time you signed in`);
        fetch(`${serverAddress}/getUser/${sessionStorage.username}/${sessionStorage.password}`).then(res =>{
        res.json().then(json =>{
            if(json.error){
                alert("user not found");
                return;
            }
            profilePicDiv.style.backgroundImage = `url(data:image/png;base64,${json.profilePicture})`;
            gamesPlayedText.innerText = `Games Played: ${json.gamesPlayed}`;
            gamesWonText.innerText = `Games Won: ${json.gamesWon}`;

            sessionStorage.setItem("gamesPlayed", parseInt(json.gamesPlayed));
            sessionStorage.setItem("gamesWon", parseInt(json.gamesWon));

            setTimeout(() => {
                alert(json.body);
            }, 200);
        })
    })
    }, 200);
}