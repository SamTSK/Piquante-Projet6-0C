//Importations
const { createUser, logUser } = require("../controllers/users");
const express = require("express");
const authRouter = express.Router();
const emailControl = require("../middleware/emailControl");
const password = require("../middleware/password");

// Routes signup & login
authRouter.post("/signup", emailControl, password, createUser)
authRouter.post("/login", logUser)

module.exports = {authRouter}
