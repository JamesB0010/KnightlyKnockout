//how to respond to form submit with js https://www.freecodecamp.org/news/how-to-submit-a-form-with-javascript/#:~:text=To%20submit%20a%20form%20using,if%20any%20data%20is%20submitted).
//how to use multer https://www.youtube.com/watch?v=EVOFt8Its6I
import serverAddress from "./serverAddress.js";

console.log(sessionStorage);

let profilePictureUpload = document.getElementById("profilePictureUpload");
profilePictureUpload.addEventListener("change", processFile, false);

let profilePicDiv = document.getElementById("profilePicture");

const reader = new FileReader();

reader.addEventListener("load", function (){
    profilePicDiv.style.backgroundImage = `url(${reader.result})`;
}, false);

let userImage = new File([], "default.png");


function processFile(){
    var ext = this.value.match(/\.([^\.]+)$/)[1];
    
    let fileIsNotImage = !(ext == 'png' || ext == 'jpg');
    
    if(fileIsNotImage){
        return;
    }
    
    const image = this.files[0];
    
    if(image){
        userImage = image;
        reader.readAsDataURL(image);
    }
}

//how to respond to form submit with js https://www.freecodecamp.org/news/how-to-submit-a-form-with-javascript/#:~:text=To%20submit%20a%20form%20using,if%20any%20data%20is%20submitted).


let form = document.getElementsByTagName("form")[0];

form.addEventListener("submit", e =>{
    e.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    //handle file data from the state before sending
    const data = new FormData();

    data.append('image', userImage);
    data.append('image', username);
    data.append('image', password);

    fetch(serverAddress + "/newUser", {
        method: "POST",
        body: data
    })
    .then(result =>{
        result.json().then(json =>{
            alert(json.body);
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
            sessionStorage.setItem("profilePicture", reader.result? reader.result: "default");
            sessionStorage.setItem("gamesPlayed", 0);
            sessionStorage.setItem("gamesWon", 0);
        })
    })
    .catch(err =>{
        console.log(err.message);
    })
});


if(sessionStorage.username){
    setTimeout(() =>{
        alert(`Hi ${sessionStorage.username} your user credentials have been remembered from the last time you signed in`);
        fetch(`${serverAddress}/getUser/${sessionStorage.username}/${sessionStorage.password}`).then(res =>{
        res.json().then(json =>{
            if(json.error){
                alert("user not found");
                return;
            }
            profilePicDiv.style.backgroundImage = `url(data:image/png;${json.profilePicture})`;
            setTimeout(() => {
                alert(json.body);
            }, 200);
        })
    })
    }, 200);
}