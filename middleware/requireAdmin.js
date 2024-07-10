const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load environment variables from .env file
dotenv.config();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_EMAIL_PASSWORD = process.env.ADMIN_EMAIL_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME;

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "You are not logged in" });
  }

  const { email, name, password } = req.user;
  if (email === ADMIN_EMAIL && name === ADMIN_NAME) {
    bcrypt.compare(ADMIN_EMAIL_PASSWORD, password)
      .then((doMatch) => {
        if (!doMatch) {
          return res.status(403).json({ error: "You are not authorized" });
        }
        req.isAdmin = true
        console.log(req.user);
        next();
      })
      .catch((err) => {
        console.log("Something went wrong", err);
        res.status(500).json({ error: `Something went wrong: ${err.message}` });
      });
  } else {
    return res.status(403).json({ error: "You are not authorized" });
  }
};

module.exports = requireAdmin;
