const Booking = require('../models/booking.models');
const Flight = require('../models/flight.models');
const Hotel = require('../models/hotel.models');

const getBookingController = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id });

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'No bookings found', bookings });
    }

    const populatedBookings = await Promise.all(bookings.map(async (booking) => {
      let populatedBooking = booking.toObject();

      if (booking.bookingType === 'flight' && booking.flightDetails && booking.flightDetails.flightId) {
        const flight = await Flight.findById(booking.flightDetails.flightId);
        if (flight) {
          populatedBooking.flightDetails = {
            ...populatedBooking.flightDetails,
            flightInfo: flight
          };
        }
      } else if (booking.bookingType === 'hotel' && booking.hotelDetails && booking.hotelDetails.hotelId) {
        const hotel = await Hotel.findById(booking.hotelDetails.hotelId);
        if (hotel) {
          populatedBooking.hotelDetails = {
            ...populatedBooking.hotelDetails,
            hotelInfo: hotel
          };
        }
      }

      return populatedBooking;
    }));

    return res.json({ bookings: populatedBookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
};

const postBookingController = async (req, res) => {
  const { bookingType, hotelDetails, flightDetails } = req.body;
  const user = req.user;
  
  if (!user || !bookingType || (!hotelDetails && !flightDetails)) {
    return res.status(400).json({ error: "All fields are required" });
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
}

const deleteBookingController = async (req, res) => {
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
}

module.exports = { getBookingController, postBookingController, deleteBookingController };