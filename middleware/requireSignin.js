const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const requireAdmin = require("./requireAdmin");

// Load environment variables from .env file
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const requireSignin = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ error: "You must be logged in" });
        }

        const token = authorization.replace("Bearer ", "");
        
        const payload = jwt.verify(token, JWT_SECRET);
        const { _id } = payload;

        const userdata = await User.findById(_id);
        if (!userdata) {
            return res.status(401).json({ error: "You must be logged in" });
        }

        req.user = userdata;

        // Check if the user is an admin
        req.isAdmin = await requireAdmin(req, res, () => {});

        next();
    } catch (err) {
        console.error(err);
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = requireSignin;