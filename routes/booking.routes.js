const express = require('express');
const bookingRouter = express.Router();
const requireSignin = require('../middleware/requireSignin');
const Booking = require('../models/booking.models');

// Get all bookings for a user
bookingRouter.get('/api/booking', requireSignin, async (req, res) => {
  console.log(req.user)
    try {
      const booking = await Booking.find({ userId: req.user._id });
      if (booking.length === 0) {
        return res.status(404).json({ error: 'No bookings found' });
      }
      return res.json({ booking });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  });

  

// Create a new booking
bookingRouter.post('/api/booking', requireSignin, async (req, res) => {
  const { bookingType, hotelDetails, flightDetails } = req.body;
  const user = req.user; // Corrected to fetch user from req.user
  
  if (!user || !bookingType || (!hotelDetails && !flightDetails)) { // Corrected the condition
    return res.status(400).json({ error: "All fields are required" }); // Changed to 400 Bad Request
  }

  try {
    let bookingData = {
      userId: user._id,
      bookingType,
      bookingDate: new Date()
    };

    if (bookingType === 'hotel') {
      bookingData.hotelDetails = hotelDetails;
    } else if (bookingType === 'flight') {
      bookingData.flightDetails = flightDetails;
    }

    const booking = new Booking(bookingData);
    await booking.save();

    return res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});


// Delete a booking
bookingRouter.delete('/api/booking/:id', requireSignin, async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.deleteOne();

    return res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

  

module.exports = bookingRouter;
