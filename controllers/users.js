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
    .then(() => res.send({ message: "Registration completed"}))
    .catch((err) => console.log("Registration failed !", err))
}

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds,)
}

module.exports = {createUser}
