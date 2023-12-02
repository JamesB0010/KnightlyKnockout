//how to respond to form submit with js https://www.freecodecamp.org/news/how-to-submit-a-form-with-javascript/#:~:text=To%20submit%20a%20form%20using,if%20any%20data%20is%20submitted).

let profilePicDiv = document.getElementById("profilePicture");



let form = document.getElementsByTagName("form")[0];

form.addEventListener("submit", e =>{
    e.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch(`http://localhost:3000/getUser/${username}/${password}`).then(res =>{
        res.json().then(json =>{
            if(json.error){
                alert("user not found");
                return;
            }
            profilePicDiv.style.backgroundImage = `url(data:image/png;base64,${json.profilePicture})`;
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
            sessionStorage.setItem("profilePicture", `url(data:image/png;base64,${json.profilePicture}`);
            setTimeout(() => {
                alert(json.body);
            }, 200);
        })
    })
})

if(sessionStorage.username){
    setTimeout(() =>{
        alert(`Hi ${sessionStorage.username} your user credentials have been remembered from the last time you signed in`);
        fetch(`http://localhost:3000/getUser/${sessionStorage.username}/${sessionStorage.password}`).then(res =>{
        res.json().then(json =>{
            if(json.error){
                alert("user not found");
                return;
            }
            profilePicDiv.style.backgroundImage = `url(data:image/png;base64,${json.profilePicture})`;
            setTimeout(() => {
                alert(json.body);
            }, 200);
        })
    })
    }, 200);
}