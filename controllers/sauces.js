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
    Product.findByIdAndDelete(id)
        .then((product) => sendClientResponse(product, res))
        .catch((err) => res.status(500).send({message: err}))
}

function deleteImage(product) {
    const imageUrl = product.imageUrl
    const fileToDelete = imageUrl.split("/").at(-1)
    return unlink(`images/${fileToDelete}`).then(() => product)
}

function modifySauce(req, res) {
    const {params: {id}} = req // nested destructuring method
    const hasnewImage = req.file != null
    const payload = makePayload(hasnewImage, req)
    
    Product.findByIdAndUpdate(id, payload)
    .then((dbResponse) => sendClientResponse(dbResponse, res))
    .catch((err) => console.error("Problem Updating", err))
}

function makePayload(hasnewImage, req) {
    if (!hasnewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    console.log("Nouvelle images à gérer")
    console.log("Voici le payload:", payload)
    return payload
}

function sendClientResponse(product, res) {
    if (product == null) {
        console.log("Nothing to Update")
        return res.status(404).send({message: "Object not found in database" })
        }
    console.log("All good, Updatind:", product)
    res.status(200).send({message: "Successfully updated" })
}

function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
}

function createSauce(req, res) {
    const { body, file } = req
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce
    
    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: makeImageUrl(req, fileName),
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    })
    product
        .save()
        .then((message) => res.status(201).send({meassage: message}))
        .catch((err) => res.status(500).send({ message: err }))
}

module.exports = {getSauces, createSauce, getSauceById, deleteSauce, deleteImage, modifySauce}