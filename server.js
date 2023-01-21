require('dotenv').config()

const express = require("express")
const app = express() // creation appli express 
const cors = require("cors")
const port = 3000
const path = require("path")
const { upload } = require("./middleware/multer")

//const bodyParser = require("body-parser")
//const serveStatic = require("serve-static")

// Connection to database
require("./mongodb") // pour lancer le fichier mongodb


// Controllers
const { createUser, logUser } = require("./controllers/users")
const { getSauces, createSauce, getSauceById } = require("./controllers/sauces")


// Nos Midllewares
app.use(cors())
app.use(express.json())

//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true}))

//app.use(express.static(path.join(__dirname, "public")))
const { authenticateUser } = require("./middleware/auth")


// Routes
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authenticateUser, getSauces)
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce)
app.get("/api/sauces/:id", authenticateUser, getSauceById)
app.get('/',(req, res) => res.send("Hello, world!"))


// Ecoute du port
app.use("/images", express.static(path.join(__dirname, "images"))) // Order matters
app.listen(port, () => { console.log("listening on port" + port)}) 


