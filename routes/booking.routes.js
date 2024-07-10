const express = require('express');
const bookingRouter = express.Router();
const requireSignin = require('../middleware/requireSignin');
const Booking = require('../models/booking.models');

const { getBookingController, postBookingController, deleteBookingController } = require("../controllers/booking.controllers")
// Get all bookings for a user
bookingRouter.get('/api/booking', requireSignin, getBookingController);

  

// Create a new booking
bookingRouter.post('/api/booking', requireSignin, postBookingController);


// Delete a booking
bookingRouter.delete('/api/booking/:id', requireSignin, deleteBookingController);

  

module.exports = bookingRouter;
