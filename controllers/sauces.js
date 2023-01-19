const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String],
})
const Product = mongoose.model("Product", productSchema)


function getSauces(req,res) {
    const header = req.header("Authorization")
    if (header == null) return res.status(403).send({mesaage: "Invalid"})

    const token = header.split(" ")[1]
    if (token == null) return res.status(403).send({mesaage: "Token cannot be null"})
     
    jwt.verify(token, process.env.JWT_PASSWORD, 
        (err, decoded) => handleToken(err, decoded, res))
    }
    
    function handleToken(err, decoded, res) {
        if (err) res.status(403).send({mesaage: "Token Invalid" + err })
        else {
            console.log("le token a l'air bon", decoded)
            res.send({message: [{sauce:"sauce1"}, {sauce: "sauce2"}]})
    }
}
 
function createSauce(req,res) {
    const product = new Product({
        userId: "ours",
        name: "ours",
        manufacturer: "ours",
        description: "ours",
        mainPepper: "ours",
        imageUrl: "ours",
        heat: 2,
        likes: 2,
        dislikes: 2,
        usersLiked: ["ours"],
        usersDisliked: ["ours"],
    })
    product.save().then((res)=> console.log("registered product", res)).catch(console)
}

module.exports = {getSauces, createSauce}