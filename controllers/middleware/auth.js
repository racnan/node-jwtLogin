const jwt = require("jsonwebtoken")

const {
    loadJSON
} = require("../../models/user.js")

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token
        const decoded = jwt.verify(token, 'Secret_Key')

        const data = loadJSON()
        const match = data.find((element) => {
            return element.username === decoded.id && element.token === token
        })
        if (!match){
            return res.send("Please login")
        }

        return next()
    } catch (e) {
        return res.send("Please login")
    }

}

module.exports = auth