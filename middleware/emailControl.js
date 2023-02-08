const validator = require('validator');
 // Pour contrôler la syntaxe de mon email 
module.exports = (req, res, next) => {
    const {email} = req.body;

    if(validator.isEmail(email)){
        next ()
    } else {
        return res
        .status(400)
        .json({error : "l'email ${email} n'est pas valide"})
    }
}