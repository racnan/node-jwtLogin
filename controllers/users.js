const express = require('express')
const path = require('path')

const auth = require('./middleware/auth.js')

const {
    checkUsername,
    saveUser,
    signin,
    authToken,
    deleteToken
} = require('../models/user.js')

const router = new express.Router()

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signUp.html'))
})

router.post('/signup', (req, res) => {
    const userExist = checkUsername(req.body)
    if (userExist) {
        return res.send("userExists")
    }

    saveUser(req.body)
    res.redirect('/signin')
})

router.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signIn.html'))
})

router.post('/signin', (req, res) => {
    if (signin(req.body) !== 'Logged In') {
        return res.send(signin(req.body))
    }

    const token = authToken(req.body.username)
    
    res.cookie("token",token).redirect('/dashboard')
})

router.post('/logout', (req, res) => {
    deleteToken(req.cookies.token)
    res.clearCookie("token").redirect('/signin')
})

router.get('/dashboard', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/dashboard.html'))
})

module.exports = router