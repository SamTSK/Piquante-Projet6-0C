const { User } = require("../mongodb")  //On récupère notre model User ,créer avec le schéma mongoose
const bcrypt = require("bcrypt"); //Import du package ce cryptage (hash password)
const jwt = require("jsonwebtoken"); // On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte

async function createUser(req, res) {
    // recupérer mon name et mon password par la requête 
    const { email, password } = req.body
    
    const hashedPassword = await hashPassword(password)

    // modèle schéma
    const user = new User({ email: email, password: hashedPassword })
    user
    .save() //Enregistre dans la base de données
    .then(() => res.status(201).send({ message: "Registration completed"}))
    .catch((err) => res.status(409).send ({message: "Registration failed !:" + err}))
}
 // hash password
function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds,)
}

async function logUser(req, res) {
        try { 

        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({email: email})
                     
        const isPasswordOk = await bcrypt.compare(password, user.password) //On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
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
