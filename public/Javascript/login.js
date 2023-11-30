//how to respond to form submit with js https://www.freecodecamp.org/news/how-to-submit-a-form-with-javascript/#:~:text=To%20submit%20a%20form%20using,if%20any%20data%20is%20submitted).

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
                alert("Logged in!");
            console.log(json);
        })
    })
})