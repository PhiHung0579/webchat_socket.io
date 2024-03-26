const formatTime = require("date-format")

const createMessages = (messagesText) => {
    return {
        messagesText,
        createAt: formatTime("dd-MM-yyyy-hh:mm:ss", new Date())
    }
}
module.exports={
    createMessages
}