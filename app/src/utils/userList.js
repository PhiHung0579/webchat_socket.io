let userList = [];
const addUser = (newUser) => (userList = [...userList, newUser])
const List = (room) => userList.filter((user) => user.room === room)
const removeUser = (id) => userList = userList.filter((user) => user.id !== id)
const findUser = (id) => userList.find((user) => user.id === id);

module.exports = {
    List,
    addUser,
    removeUser,
    findUser
}