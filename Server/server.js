//server init code from learn socket io in 30 minuets video https://www.youtube.com/watch?v=ZKEqqIO7n-k
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173']
    }
})


io.on("connection", socket =>{
    console.log("Someone joined with id" + socket.id);

    socket.emit('setId', socket.id);

    socket.on("playerUpdatePosition", data =>{
        socket.broadcast.emit("updateNetworkedPlayerPosition", {pos: data.pos,id: data.id})
    })

    socket.on('disconnect', ()=>{
        console.log(socket.id + " Disconnected");
    })
})