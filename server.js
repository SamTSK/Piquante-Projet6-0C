const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000

// Nos Midllewares
app.use(cors())
app.use(express.json())

// Routes

app.post("/api/auth/signup", (req,res) => {
    console.log("signup request:", req.body)
    res.send({ message: "Inscription effectuée !"})
})
app.get('/',(req, res) => res.send("Hello, world!"))
app.listen(port, () => { console.log("listening on port" + port)}) // Ecoute du port
