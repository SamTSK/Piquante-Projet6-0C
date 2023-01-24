require('dotenv').config()

const express = require("express")
const app = express() 
const cors = require("cors")

const {saucesRouter} = require("./routers/sauces.router")
const {authRouter} = require("./routers/auth.router")
const bodyParser = require("body-parser")
const port = 3000
const path = require("path")


// Connection to database
require("./mongodb") // pour lancer le fichier mongodb


// Nos Midllewares
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())   

app.use("/api/sauces", saucesRouter)
app.use("/api/auth", authRouter)


// Routes
app.get('/',(req, res) => res.send("Hello, world!"))


// Ecoute du port
app.use("/images", express.static(path.join(__dirname, "images"))) // Order matters
app.listen(port, () => { console.log("listening on port" + port)}) 


