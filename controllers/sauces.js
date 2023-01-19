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



    
function getSauces(req, res) {
        console.log("le token a été validé, nous sommes dans get sauces")
        //authenticateUser(req, res) à SUPPRIMER 
        //console.log("le token a l'air bon", decoded)
        Product.find({}).then(products => res.send(products))
        //res.send({message: [{sauce:"sauce1"}, {sauce: "sauce2"}]})
}
 
function createSauce(req,res) {
    const name = req.body.name
    const manufacturer = req.body.manufacturer 
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
    product.save().then((res)=> console.log("Registered product", res)).catch(console.error)
}

module.exports = {getSauces, createSauce}