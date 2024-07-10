const express = require("express");
const hotelRouter = express.Router();
const requireSignin = require("../middleware/requireSignin");
const requireAdmin = require("../middleware/requireAdmin");
const { getHotelController, postHotelController, putHotelController, deleteHotelController } = require("../controllers/hotels.controllers")

// Get hotels
hotelRouter.get("/api/hotel", requireSignin, getHotelController );

// Create hotel
hotelRouter.post("/api/hotel", requireSignin, requireAdmin, postHotelController);

// Update hotel
hotelRouter.put("/api/hotel", requireSignin, requireAdmin, putHotelController);

// Delete hotel
hotelRouter.delete("/api/hotel", requireSignin, requireAdmin, deleteHotelController);

module.exports = hotelRouter;
