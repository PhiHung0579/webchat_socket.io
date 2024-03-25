//yêu cầu server kết nối với client 
const socket = io();


document.getElementById("form-messages").addEventListener("submit", (e) => {
    e.preventDefault();
    const messagesText = document.getElementById("input-messages").value;
    const acknowledgement = (errors) => {
        if (errors) {
            return alert("messages invalid")
        }
        console.log("messages send successful")
    }
    socket.emit("send messages from client to server", messagesText, acknowledgement);
})

socket.on("send messages from server to client", (messagesText) => {
    console.log(messagesText);
})
//send location
document.getElementById("btn-share-location").addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        const { latitude, longitude } = position.coords;
        socket.emit("share location from client to server", { latitude, longitude })
    })
})
//give location
socket.on("send location from server to client", (linkLocation) => {
    console.log(linkLocation)
})