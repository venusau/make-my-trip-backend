const express = require("express");
const hotelRouter = express.Router();
const requireSignin = require("../middleware/requireSignin");
const requireAdmin = require("../middleware/requireAdmin");
const Hotel = require("../models/hotel.models");

// Get hotels
hotelRouter.get("/api/hotel", requireSignin, async (req, res) => {
  const filter = req.body; 
  try {
    const hotels = await Hotel.find(filter);
    if (hotels.length === 0) {
      return res.status(404).json({ error: "No hotels to show" });
    }
    return res.json({ message: "Successfully found the hotels", hotels });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// Create hotel
hotelRouter.post("/api/hotel", requireSignin, requireAdmin, async (req, res) => {
  try {
    const hotelDetails = req.body;

    const hotel = new Hotel(hotelDetails);
    await hotel.save();

    return res.status(201).json({ message: "Hotel created successfully", hotel });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// Update hotel
hotelRouter.put("/api/hotel", requireSignin, requireAdmin, async (req, res) => {
  const { hotelId, ...hotelDetails } = req.body;
  console.log(hotelId);

  try {
    let hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    await Hotel.updateOne({ _id: hotelId }, { $set: hotelDetails });
    hotel = await Hotel.findById(hotelId);

    return res.json({ message: "Hotel updated successfully", hotel });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// Delete hotel
hotelRouter.delete("/api/hotel", requireSignin, requireAdmin, async (req, res) => {
  const { hotelId } = req.body;
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotelId || !hotel) {
      return res.status(404).json({ error: "Hotel not found or hotelId not sent properly" });
    }
    await Hotel.deleteOne({ _id: hotelId });
    return res.json({ message: "Hotel has been deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

module.exports = hotelRouter;
