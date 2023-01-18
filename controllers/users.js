const { User } = require("../mongodb")
const bcrypt = require('bcrypt');


async function createUser(req, res) {
    // recupérer mon name et mon password par la requête 
    const { email, password } = req.body
    
    const hashedPassword = await hashPassword(password)

    // modèle schéma
    const user = new User({ email: email, password: hashedPassword })
    user
    .save()
    .then(() => res.status(201).send({ message: "Registration completed"}))
    .catch((err) => res.status(409).send ({message: "Registration failed !:" + err}))
}

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds,)
}
function logUser(req, res) {
    const email = req.body.email
    const password = req.body.password

}

module.exports = {createUser, logUser}
