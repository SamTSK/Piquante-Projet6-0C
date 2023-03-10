const mongoose = require("mongoose")
const { unlink } = require("fs/promises") // Supp filesystem

// Schéma
const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: { type: Number, min: 1, max: 10 },
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
// Model
const Product = mongoose.model("Product", productSchema)

function getSauces(req, res) {
        //Product.deleteMany({}).then(console.log).catch(console.error) // delete all products 
        Product.find({}) 
            .then((products) => res.send(products))
            .catch(error => res.status(500).send(error))
}

function getSauce(req, res) {
    const { id } = req.params
    return Product.findById(id)
}

function getSauceById(req, res) {
    getSauce(req, res)
        .then((product) => sendClientResponse(product,res))
        .catch((err) => res.status(500).send(err))
}

function deleteSauce(req, res) {
    const { id } = req.params
    Product.findByIdAndDelete(id)
        .then((product) => sendClientResponse(product, res))
        .then((item) => deleteImage(item))
        .then((res) => console.log("File Deleted", res))
        .catch((err) => console.error("File not deleted", err))
}

function modifySauce(req, res) {
    const {params: {id}} = req // nested destructuring method
    const hasnewImage = req.file != null
    const payload = makePayload(hasnewImage, req)
    
    Product.findByIdAndUpdate(id, payload)
    .then((dbResponse) => sendClientResponse(dbResponse, res))
    .then((product) => deleteImage(product))
    .then((res) => console.log("File Deleted", res))
    .catch((err) => console.error("Problem Updating", err))
}

function deleteImage(product) {
    console.log("Product:",product)
    if (product == null) return
    console.log("Delete Image", product)
    const imageToDelete = product.imageUrl.split("/").at(-1)
    return unlink("images/" + imageToDelete) //Utilisation de la fonction unlink pour supprimer l'image et suppression de toute la Sauce
}


function makePayload(hasnewImage, req) {
    console.log("hasnewImage:", hasnewImage)
    if (!hasnewImage) return req.body
    const payload = JSON.parse(req.body.sauce) //Pour extraire les données JSON de l'objet crée
    payload.imageUrl = makeImageUrl(req, req.file.filename)
    console.log("Nouvelle image à gérer")
    console.log("Voici le payload:", payload)
    return payload
}

function sendClientResponse(product, res) {
    if (product == null) {
        console.log("Nothing to Update")
        return //res.status(404).send({ message: "Object not found in database" })
        }
    console.log("All good, Updating:", product)
    return Promise.resolve(res.status(200).send(product)).then(() => product) // promise.resole method
}

function makeImageUrl(req, filename) { // Pour générer l'URL de l'image de l'objet crée 
    return req.protocol + "://" + req.get("host") + "/images/" + filename
}

function createSauce(req, res) {
    const { body, file } = req
    const { filename } = file
    const sauce = JSON.parse(body.sauce) //Pour extraire les données JSON de l'objet crée
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce
    console.log(file)
    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: makeImageUrl(req, filename),
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    })
    product
        .save() //Enregistre dans la base de données
        .then((message) => res.status(201).send({meassage: message}))
        .catch((err) => res.status(500).send({ message: err }))
}

function likeSauce(req, res){
    const {like, userId} = req.body
    //  like === 0, -1, 1
    if (![1, -1, 0].includes(like)) return res.status(403).send({ message: "Invalid like value" })

    getSauce(req, res)
    
        .then((product) => updateVote(product, like, userId, res))
        .then((pr) => pr.save())
        .then(prod => sendClientResponse(prod, res))
        .catch((err) => res.status(500).send(err))
}

function updateVote(product, like, userId, res) {
    // Trois cas: 0, 1, -1
    if (like === 1 || like === -1) return incrementVote(product, userId, like)
    return resetVote(product, userId, res)
}

function resetVote(product, userId, res) {
    const { usersLiked, usersDisliked } = product
    if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId))) 
        return Promise.reject("User seems to have voted both ways")

    if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
        return Promise.reject("User seems to not have voted")

    if (usersLiked.includes(userId)) {
        --product.likes
        product.usersLiked = product.usersLiked.filter((id) => id !== userId) // Array.prototype.filter
      } else {
        --product.dislikes
        product.usersDisliked = product.usersDisliked.filter((id) => id !== userId)
      }
    
      return product
}

function incrementVote(product, userId, like) {
    const { usersLiked, usersDisliked } = product

    const votersArray = like === 1 ? usersLiked : usersDisliked
    if (votersArray.includes(userId)) return product
    votersArray.push(userId)

    like === 1 ? ++product.likes : ++product.dislikes
    return product
}

module.exports = { sendClientResponse, getSauce, getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce }

