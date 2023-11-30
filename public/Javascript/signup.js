//how to respond to form submit with js https://www.freecodecamp.org/news/how-to-submit-a-form-with-javascript/#:~:text=To%20submit%20a%20form%20using,if%20any%20data%20is%20submitted).

let profilePictureUpload = document.getElementById("profilePictureUpload");
profilePictureUpload.addEventListener("change", processFile, false);
let profilePicDiv = document.getElementById("profilePicture");

const reader = new FileReader();

reader.addEventListener("load", function (){
    profilePicDiv.style.backgroundImage = `url(${reader.result})`;
}, false);

function processFile(){
    var ext = this.value.match(/\.([^\.]+)$/)[1];

    let fileIsNotImage = !(ext == 'png' || ext == 'jpg');

    if(fileIsNotImage){
        return;
    }

    const image = this.files[0];

    if(image){
        reader.readAsDataURL(image);
    }
}



let form = document.getElementsByTagName("form")[0];

form.addEventListener("submit", e =>{
    e.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch(`http://localhost:3000/newUser/${username}/${password}`, {
        method: "POST"
    }).then(res =>{
        res.json().then(json =>{
            if (json.error){
                alert("user already exists");
                return;
            }
            alert("Signed up successfully");
            console.log(json);
        })
    })
})