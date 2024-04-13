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

socket.on("send messages from server to client", (message) => {
    console.log(message);
    //hien thi len man hinh 
    const { createAt, messagesText, username } = message;
    const htmlContent = document.getElementById("app__messages").innerHTML;
    const messageElement = `
     <div class="message-item">
    <div class="message__row1">
      <p class="message__name">${username}</p>
      <p class="message__date">${createAt}</p>  
    </div>
    <div class="message__row2">
      <p class="message__content">
      ${messagesText}
      </p>
    </div>
     </div>`
    let renderHtml = htmlContent + messageElement
    document.getElementById("app__messages").innerHTML = renderHtml;
    //clear input
    document.getElementById("input-messages").value = "";
});
//send location
document.getElementById("btn-share-location").addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        const { latitude, longitude } = position.coords;
        socket.emit("share location from client to server", { latitude, longitude })
    })
})
//give location
socket.on("send location from server to client", (data) => {
    const { createAt, messagesText, username } = data;

    const htmlContent = document.getElementById("app__messages").innerHTML;
    const messageElement = `
     <div class="message-item">
    <div class="message__row1">
      <p class="message__name">${username}</p>
      <p class="message__date">${createAt}</p>  
    </div>
    <div class="message__row2">
      <p class="message__content">
      <a href=" ${messagesText}" target="_blank"> vị trí của${username} </a> 
      </p>
    </div>
     </div>`
    let renderHtml = htmlContent + messageElement
    document.getElementById("app__messages").innerHTML = renderHtml;

})

//xu ly query string
const queryString = location.search;
const params = Qs.parse(queryString, {
    ignoreQueryPrefix: true,
});
const { room, username } = params;

socket.emit("join room from client to server", { room, username })

//xu ly list user
socket.on("send listUser from to server to client", (userList) => {
    console.log(userList)
    let contentHtml = "";
    userList.map((user) => {
        contentHtml += `<li class="app__item-user">${user.username}</li>`
    })
    document.getElementById("app__list-user--content").innerHTML = contentHtml;
})
//note from branch phihung
document.getElementById("app__title").innerHTML = room;