const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load environment variables from .env file
dotenv.config();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_EMAIL_PASSWORD = process.env.ADMIN_EMAIL_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME;

const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return false
  }

  const { email, name, password } = req.user;

  try {
    if (email === ADMIN_EMAIL && name === ADMIN_NAME) {
      const doMatch = await bcrypt.compare(ADMIN_EMAIL_PASSWORD, password);
      if (!doMatch) {
        return false
      }
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log("Something went wrong", error);
    return false, error
  }
};

module.exports = requireAdmin;
