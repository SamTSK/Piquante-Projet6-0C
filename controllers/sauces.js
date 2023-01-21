const mongoose = require("mongoose")
const unlink = require("fs").promises.unlink

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
        //Product.deleteMany({}).then(console.log).catch(console.error) // delete all products 
        Product.find({})
            .then(products => res.send(products))
            .catch(error => res.status(500).send(error))
}

function getSauceById(req, res) {
    const {id} = req.params
    Product.findById(id)
        .then((product) => res.send(product))
        .catch(console.error)
}

function deleteSauce(req, res) {
    const {id} = req.params

    // 1. L'ordre de suppression du produit est envoyé à Mongo 
    Product.findByIdAndDelete(id)
       // 2. Supprimer l'image localement
    .then(deleteImage) 
          // 3. Envoyer un message de succès au site web (au client)
    .then((product) => res.send ({ message: product}))
    .catch((err) => res.status(500).send({message: err}))
}


function deleteImage(product) {
    const imageUrl = product.imageUrl
    const fileToDelete = imageUrl.split("/").at(-1)
    return unlink(`images/${fileToDelete}`).then(() => product)
}

function modifySauce(req, res) {
    const {body, file} = req
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

}

function createSauce(req,res) {
    const { body, file} = req
    const { fileName } = file.fileName
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

    function makeImageUrl(req, fileName) {
        return req.protocol + "://" + req.get("host") + "/images/" + fileName
    }
    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: makeImageUrl(req, fileName) ,
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    })
    product
        .save()
        .then((message) => { 
            res.status(201).send({meassage: message});
            return console.log("Registered product", message)
        })
        .catch(console.error)
}

module.exports = {getSauces, createSauce, getSauceById, deleteSauce, modifySauce}