const Hotel = require("../models/hotel.models");
const { postBookingController } = require("./booking.controllers");

const getHotelController = async (req, res) => {
    const {checkInDate, checkOutDate, ...filter} = req.query; 
    console.log(filter)
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
  }

const postHotelController = async (req, res) => {
    try {
      const hotelDetails = req.body;
  
      const hotel = new Hotel(hotelDetails);
      await hotel.save();
  
      return res.status(201).json({ message: "Hotel created successfully", hotel });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  }

const putHotelController = async (req, res) => {
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
  }

const deleteHotelController = async (req, res) => {
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
  }

module.exports = { getHotelController, postHotelController, putHotelController, deleteHotelController }