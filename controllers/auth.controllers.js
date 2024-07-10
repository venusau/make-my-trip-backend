const bcrypt = require("bcryptjs");
const { joiUserCreationSchema } = require("../validations/userCreationValidations");
const User = require("../models/user.models")
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require("jsonwebtoken")

const signinController = (req, res) => {
    const { email, password } = req.body;
    
  
    if (!email || !password) {
        return res.status(422).json({ error: "All fields are required" });
    }
  
    User.findOne({ email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or Password" });
            }
  
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (!doMatch) {
                        return res.status(422).json({ error: "Invalid Email or Password" });
                    }
  
                    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                    const { _id, name, email } = savedUser;
                    res.json({
                        message: "Successfully signed in",
                        token,
                        user: { _id, name, email }
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: "Internal server error" });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        });
  };

  const signupController = (req, res)=>{
    const {name, email, password} = req.body
    if(!name || !email || !password){
        return res.status(422).json({error:"all fields are required"})
    }
    User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        if (savedUser.email === email) {
          return res.status(422).json({ error: "Email already exists" });
        } 
      }

      const { error } = joiUserCreationSchema.validate({
        name,
        email,
        password,
      });
      if (error) {
        return res.status(422).json({ error: error.details[0].message });
      }

      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "User saved successfully" });
          })
          .catch((err) => {
            if (err.code === 11000) {
              // Check for duplicate key error
              const duplicateField = Object.keys(err.keyPattern)[0];
              res
                .status(422)
                .json({
                  error: `${
                    duplicateField.charAt(0).toUpperCase() +
                    duplicateField.slice(1)
                  } already exists`,
                });
            } else {
              console.log(err);
              res.status(500).json({ err });
            }
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });

}

  module.exports = {signinController, signupController}

