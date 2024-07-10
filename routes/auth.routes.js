const express = require("express")
const auth = express.Router()
const requireSignin = require("../middleware/requireSignin")

const {signinController, signupController} = require("../controllers/auth.controllers")

auth.post("/api/auth/signin", signinController);

auth.post("/api/auth/signup", signupController)

module.exports = auth