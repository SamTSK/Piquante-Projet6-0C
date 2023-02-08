// Utilisation de multer pour enregistrer les fichiers images
const multer = require("multer") //Permet de gérer les fichiers entrants dans les requêtes HTTP


const storage = multer.diskStorage({
    destination: "images/",           // Enregistrement dans le dossier "images"
    filename: function (req, file, cb) {
        cb(null, makeFilename(req, file))
    }
})


function makeFilename(req, file) {
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
    file.fileName = fileName
    return fileName
  }
const upload = multer({storage: storage})

module.exports = { upload}
