const express = require('express')
const app = express();
const path = require("path");
const http = require('http');
const socketio = require("socket.io");

const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = socketio(server);

let count = 1;
const messages="chào mọi người";
//lắng nghe sự kiện kết nối từ client 
io.on("connection", (socket) => {
    console.log("new client connect ");

    //nhận lại sự kiện từ client 
    socket.on("send increment client to server",()=>{
        count++;

    //truyền count từ server về cho client
    socket.emit("send count server to client", count)
    });

    //truyền count từ server về cho client
    socket.emit("send count server to client", count)

    socket.emit("send messages server to client", messages)
    //ngat ket noi
    socket.on("disconnect", () => {
        console.log("client left server")
    })
})

const port = 5000;
server.listen(port, () => {
    console.log(`app run on http://localhost:${port}`)
})