// Database
const mongoose = require('mongoose')
const password = "Oc2023!"
const uri = `mongodb+srv://user1:${password}@cluster0.krf0fda.mongodb.net/?retryWrites=true&w=majority`;


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
