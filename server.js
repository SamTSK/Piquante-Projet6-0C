const express = require("express")
const app = express() // creation appli express 

const cors = require("cors")
const port = 3000


// Database
const mongoose = require('mongoose')
const password = "Oc2023!"
const uri = `mongodb+srv://user1:${password}@cluster0.krf0fda.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri)
    .then ((() =>console.log("Connected to Mongo !")))
    .catch(err => console.error("Error, you are not connecting to Mongo", err))
                // Schéma creation
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
}); // puis création d'un objet qui correspond à ce schéma
const User = mongoose.model("User", userSchema)



// Nos Midllewares
app.use(cors())
app.use(express.json())


// Routes

app.post("/api/auth/signup", (req,res) => {
    console.log("signup request:", req.body)
    // recupérer mon name et mon password par la requête 
    const email = req.body.email
    const password = req.body.password
    // modèle schéma
    const user = new User({email: email, password: password})
user
    .save() // je ne mets pas de "await" parce que je ne suis pas dans une fonction
    .then(res => console.log("The user has been successfully registered", res))
    .catch(err => console.log("Registration failed !", err))

    res.send({ message: "Inscription effectuée !"})
})
app.get('/',(req, res) => res.send("Hello, world!"))
app.listen(port, () => { console.log("listening on port" + port)}) // Ecoute du port
