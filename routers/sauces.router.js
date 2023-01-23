const express = require("express")
const {
    getSauces,
    createSauce,
    getSauceById,
    deleteSauce,
    modifySauce,
    likeSauce
  } = require("../controllers/sautes")
const { authenticateUser} = require("../middleware/auth")
const { upload } = require("../middleware/multer")
const saucesRouter = express.Router()
//const bodyParser = require("body-parser")

saucesRouter.get("/", authenticateUser, getSauces)
saucesRouter.post("/", authenticateUser, upload.single("image"), createSauce)
saucesRouter.get("/:id", authenticateUser, getSauceById)
saucesRouter.delete("/:id", authenticateUser, deleteSauce)
saucesRouter.put("/:id", authenticateUser,upload.single("image"), modifySauce)
saucesRouter.post("/:id/like", authenticateUser, likeSauce)

module.exports = {saucesRouter}
