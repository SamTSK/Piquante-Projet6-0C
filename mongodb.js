// Database
const mongoose = require('mongoose')
const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const uri = `mongodb+srv://${username}:${password}@cluster0.krf0fda.mongodb.net/?retryWrites=true&w=majority`;


mongoose
    .connect(uri)
    .then (() => console.log("Connected to Mongo !"))
    .catch((err) => console.error("Error, you are not connecting to Mongo", err))
                // Schéma creation
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
}); // puis création d'un objet qui correspond à ce schéma
const User = mongoose.model("User", userSchema)


module.exports = {mongoose, User}
