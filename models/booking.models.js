const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Booking Schema
const bookingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['hotel', 'flight'],
    required: true
  },
  hotelDetails: {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel'
    },
    roomNumber: {
      type: String
    },
    checkInDate: {
      type: Date
    },
    checkOutDate: {
      type: Date
    }
  },
  flightDetails: {
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight'
    },
    seatNumber: {
      type: String
    },
    departureDate: {
      type: Date
    },
    returnDate: {
      type: Date
    }
  },
  bookingDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'pending'
  }
});

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
