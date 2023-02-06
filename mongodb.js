// Database
const mongoose = require('mongoose')
const uniqueValidator = require("mongoose-unique-validator")
const MongooseErrors = require( ' mongoose-errors ' ) 

const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const uri = `mongodb+srv://${username}:${password}@cluster0.krf0fda.mongodb.net/?retryWrites=true&w=majority`;


mongoose
    .connect(uri)
    .then (() => console.log("Connected to Mongo !"))
    .catch((err) => console.error("Error, you are not connecting to Mongo", err))
                // Schéma creation
const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
}); 
userSchema.plugin(uniqueValidator)
userSchema.plugin(MongooseErrors) 

// puis création d'un objet qui correspond à ce schéma
const User = mongoose.model("User", userSchema)


module.exports = {mongoose, User}

