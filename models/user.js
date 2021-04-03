const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

// const user = {
//     firstname: "abc",
//     lastname:  "xyz",
//     username : "user88",
//     password : "abcabc",
//     token: "",
// }

const saveJSON = (user) => {
    const dataJSON = JSON.stringify(user)
    fs.writeFileSync('./models/data/data.json', dataJSON)
}

const loadJSON = () => {
    try {
        const dataBuffer = fs.readFileSync('./models/data/data.json')
        //dataBuffer = <Buffer 7b 22 75 73 ...

        const dataJSON = dataBuffer.toString()
        //dataJSON = {"username":"user2", ...

        return JSON.parse(dataJSON)
        //JSON.parse(dataJSON) = { username: 'user2', ...
    } catch (e) {
        //console.log(e)
        return []
    }
}

const hashPasword = (password) => {
    return bcrypt.hashSync(password, 8)
}

const saveUser = (user) => {
    const data = loadJSON()
    data.push({
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        password: hashPasword(user.password),
    })

    saveJSON(data)
}

const checkUsername = (user) => {
    const data = loadJSON()
    const match = data.find((element) => {
        return user.username === element.username
    })

    return match
}

const signin = (user) => {
    const data = loadJSON()
    const match = data.findIndex((element) => {
        return element.username === user.username
    })

    if (match === -1) {
        return "No Such User"
    }

    if (!bcrypt.compareSync(user.password, data[match].password)) {
        return "Invalid Password"
    }

    return "Logged In"
}

const authToken = (username) => {
    const data = loadJSON()

    const index = data.findIndex((element) => element.username === username)

    const token = jwt.sign({
        id: username
    }, "Secret_Key")

    data[index].token = token

    saveJSON(data)

    return token
}

const deleteToken = (token) => {
    const data = loadJSON()

    const decode = jwt.decode(token, "Secret_Key")

    const match = data.findIndex((element) => decode.id === element.username)

    data[match].token = null
    saveJSON(data)
}

module.exports = {
    loadJSON,
    saveUser,
    checkUsername,
    signin,
    authToken,
    deleteToken
}