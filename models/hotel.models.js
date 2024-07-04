const mongoose = require("mongoose");
const { Schema } = mongoose;

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  rooms: [
    {
      roomNumber: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      amenities: [String],
      availability: {
        type: Boolean,
        default: true,
      },
    },
  ],
  amenities: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
      comment: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
