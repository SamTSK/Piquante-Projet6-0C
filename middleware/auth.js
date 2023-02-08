const jwt = require("jsonwebtoken") // Import du package de création de token

function authenticateUser(req, res, next) {
    console.log("authenticate user")
    const header = req.header("Authorization")
    if (header == null) return res.status(403).send({mesaage: "Invalid"})

    const token = header.split(" ")[1]
    if (token == null) return res.status(403).send({mesaage: "Token cannot be null"})
     
    // Vérification token
    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err) return res.status(403).send({message: "Token Invalid" + err })
        console.log("Le token est bien valide, on continue")
        next()
    })
}  

module.exports = { authenticateUser }