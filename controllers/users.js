const { User } = require("../mongodb")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
async function logUser(req, res) {
        try { 

        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({email: email})
        
        const isPasswordOk = await bcrypt.compare(password, user.password)
        if (!isPasswordOk) {
            res.status(403).send({ message : " Incorrect password"})
        }
        const token = createToken(email)
        res.status(200).send({ userId: user._id, token: token})
        } catch (err) {
            console.error(err)
            res.status(500).send({ message: "Erreur interne"})
        }

    }  

function createToken(email) {
    const jwtPassword = process.env.JWT_PASSWORD
    const token = jwt.sign({email: email}, jwtPassword, {expiresIn: "24h"})
    return token
}

//User.deleteMany({}).then(()=> console.log("all removed"))  // remove all users
module.exports = {createUser, logUser}
