const mongoose = require("mongoose");
const { Schema } = mongoose;

const flightSchema = new Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  seatsAvailable: {
    type: Number,
    required: true
  },
  seatType: {
    type: String,
    enum: ["Economy", "Business", "First"],
    required: true
  },
  status: {
    type: String,
    enum: ["Scheduled", "Cancelled", "Delayed"],
    default: "Scheduled"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

flightSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;
