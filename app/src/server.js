const express = require('express')
const app = express();
const path = require("path");
const http = require('http');
const socketio = require("socket.io");
const Fillter = require("bad-words")

const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = socketio(server);

let count = 1;
const messages = "chào mọi người";
//lắng nghe sự kiện kết nối từ client 
io.on("connection", (socket) => {
    //send to client when connect 
    socket.emit("send messages from server to client",
        "Welcom to webchat");
    socket.broadcast.emit("send messages from server to client",
        "Have new client join to room ")
    socket.on("send messages from client to server", (messagesText, callback) => {
        const fillter = new Fillter();
        if (fillter.isProfane(messagesText)) {
            return callback("message not invalid because have bad-words");
        }
        io.emit("send messages from server to client", messagesText);
        callback();
    });
    //xu li share location
    socket.on("share location from client to server",
        ({ latitude, longitude }) => {
            const linkLocation = `http://www.google.com/map?q=${latitude},${longitude}`;
            io.emit("send location from server to client",linkLocation)
    });


    //ngat ket noi
    socket.on("disconnect", () => {
        console.log("client left server")
    })
})

const port = 5000;
server.listen(port, () => {
    console.log(`app run on http://localhost:${port}`)
})