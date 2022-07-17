// npm install bcrypt express cookie-parser cors jsonwebtoken mongoose nodemon multer

const express = require('express')
const cors = require('cors')

const app = express()

// Config JSON response
app.use(express.json())

//In this project we do not need URLenconded as we are only going to work with json 

// Solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

// Public fold for images
app.use(express.static('public'))

// Routes
const UserRoutes = require('./routes/UserRoutes')
app.use('/users', UserRoutes)

app.listen(5000)