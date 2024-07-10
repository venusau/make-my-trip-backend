const express = require("express")
const auth = express.Router()
const requireSignin = require("../middleware/requireSignin")

const {signinController, signupController} = require("../controllers/auth.controllers")

auth.post("/api/auth/signin", signinController);

auth.post("/api/auth/signup", signupController)

auth.get("/api/admin", requireSignin, async (req, res, next)=>{
  
        res.json({isAdmin:req.isAdmin})
    
})

module.exports = auth