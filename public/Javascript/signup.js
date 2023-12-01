//how to respond to form submit with js https://www.freecodecamp.org/news/how-to-submit-a-form-with-javascript/#:~:text=To%20submit%20a%20form%20using,if%20any%20data%20is%20submitted).
//how to use multer https://www.youtube.com/watch?v=EVOFt8Its6I

let profilePictureUpload = document.getElementById("profilePictureUpload");
profilePictureUpload.addEventListener("change", processFile, false);

let profilePicDiv = document.getElementById("profilePicture");

const reader = new FileReader();

let userImage;


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

reader.addEventListener("load", function (){
    profilePicDiv.style.backgroundImage = `url(${reader.result})`;
}, false);

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

    fetch("http://localhost:3000/newUser", {
        method: "POST",
        body: data
    })
    .then(result =>{
        console.log("user signed up");
    })
    .catch(err =>{
        console.log(err.message);
    })
});
