const mongoose = require("mongoose")
const { unlink } = require("fs/promises")
const { likeSauce } = require("./vote")

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: {type: Number, min:1, max: 5},
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
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
        .catch((err) => res.status(500).send({message: err}))
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
    if (product == null) return
    console.log("Delete Image", product)
    const imageToDelete = product.imageUrl.split("/").at(-1)
    return unlink("images/" + imageToDelete)
}


function makePayload(hasnewImage, req) {
    console.log("hasnewImage:", hasnewImage)
    if (!hasnewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.filename)
    console.log("Nouvelle image à gérer")
    console.log("Voici le payload:", payload)
    return payload
}

function sendClientResponse(product, res) {
    if (product == null) {
        console.log("Nothing to Update")
        return res.status(404).send({message: "Object not found in database" })
        }
    console.log("All good, Updating:", product)
    return Promise.resolve(res.status(200).send(product)).then(() => product) // promise.resole method
}

function makeImageUrl(req, filename) {
    return req.protocol + "://" + req.get("host") + "/images/" + filename
}

function createSauce(req, res) {
    const { body, file } = req
    const { filename } = file
    const sauce = JSON.parse(body.sauce)
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
        .save()
        .then((message) => res.status(201).send({meassage: message}))
        .catch((err) => res.status(500).send({ message: err }))
}


module.exports = {sendClientResponse, getSauce, getSauces, createSauce, getSauceById, deleteSauce, deleteImage, modifySauce, likeSauce}