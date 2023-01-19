require('dotenv').config()

const express = require("express")
const app = express() // creation appli express 
const cors = require("cors")
const port = 3000

const bodyParser = require("body-parser")

// Connection to database
require("./mongodb") // pour lancer le fichier mongodb


// Controllers
const { createUser, logUser } = require("./controllers/users")
const { getSauces, createSauce } = require("./controllers/sauces")


// Nos Midllewares
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
const { authenticateUser } = require("./middleware/auth")
const multer = require("multer")
const upload = multer().single("image")

// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authenticateUser, getSauces)
app.post("/api/sauces", authenticateUser, upload, createSauce)
app.get('/',(req, res) => res.send("Hello, world!"))


// Ecoute du port
app.listen(port, () => { console.log("listening on port" + port)}) 


