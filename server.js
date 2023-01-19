require('dotenv').config()

const express = require("express")
const app = express() // creation appli express 

const cors = require("cors")
const port = 3000

// Connection to database
require("./mongodb") // pour lancer le fichier mongodb


// Controllers
const { createUser, logUser } = require("./controllers/users")
const { getSauces } = require("./controllers/sauces")


// Nos Midllewares
app.use(cors())
app.use(express.json())


// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", getSauces)
app.get('/',(req, res) => res.send("Hello, world!"))


// Ecoute du port
app.listen(port, () => { console.log("listening on port" + port)}) 


