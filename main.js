const express = require('express')
const cookieParser = require('cookie-parser')

const userRouter = require('./controllers/users.js')

const PORT = 3000
const app = express()

app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())

app.use(userRouter)

app.listen(PORT, () => {
    console.log(`Server is up at port ${PORT}`)
})