const {User} = require("../mongodb")


function createUser(req, res) {
    // recupérer mon name et mon password par la requête 
    const email = req.body.email
    const password = req.body.password
    // modèle schéma
    const user = new User({email: email, password: password})
user
    .save()
    .then(() => res.send({ message: "Registration completed"}))
    .catch(err => console.log("Registration failed !", err))
}

module.exports = {createUser}
