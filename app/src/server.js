const express = require('express')
const app = express();
const path = require("path");
const http = require('http');
const socketio = require("socket.io");
const Fillter = require("bad-words")
const formatTime = require("date-format")
const { createMessages } = require("./utils/create-messages")
const { List, addUser, removeUser, findUser } = require("./utils/userList")

const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = socketio(server);


//lắng nghe sự kiện kết nối từ client 
io.on("connection", (socket) => {


    socket.on("join room from client to server", ({ room, username }) => {
        socket.join(room);
        //chào client khi kết nối thành công
        socket.emit("send messages from server to client",
            createMessages(`Chào mừng ${username} đến với phòng ${room} `,"Admin"));
        socket.broadcast.to(room).emit("send messages from server to client",
            createMessages(`client${username} vừa tham gia vào phòng${room}`,"Admin"));

        //chat
        socket.on("send messages from client to server", (messagesText, callback) => {
            const fillter = new Fillter();
            if (fillter.isProfane(messagesText)) {
                return callback("message not invalid because have bad-words");
            };
            const id = socket.id;
            const user = findUser(id);

            io.to(room).emit("send messages from server to client", createMessages(messagesText,user.username));
            callback();
        });
        //xử lí share location
        socket.on("share location from client to server",
            ({ latitude, longitude }) => {
                const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
                const id = socket.id;
            const user = findUser(id);
                io.to(room).emit("send location from server to client", createMessages(linkLocation,user.username))
            });

        //xử lí userList
        const newUser = {
            id: socket.id,
            username: username,
            room: room,

        }
        addUser(newUser)
        io.to(room).emit("send listUser from to server to client", List(room));
        //ngat ket noi
        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.to(room).emit("send listUser from to server to client", List(room));
            console.log("client left server")
        });
    });
})

const port = 5000;
server.listen(port, () => {
    console.log(`app run on http://localhost:${port}`)
})