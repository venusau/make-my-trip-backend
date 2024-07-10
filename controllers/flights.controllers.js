const Flight = require("../models/flight.models");
const { validationResult } = require("express-validator");

const getFlightController = async (req, res) => {
  const { from, to, departureTime, seats } = req.query;
  
  try {
    let flights = [];

    if (req.isAdmin) {
      flights = await Flight.find({});
      console.log("Admin fetching all flights", flights.length);
    } else {
      if (!from || !to || !departureTime || !seats) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const parsedDepartureTime = new Date(departureTime);
      if (isNaN(parsedDepartureTime.getTime())) {
        return res.status(400).json({ error: "Invalid departure time format" });
      }

      const parsedSeats = parseInt(seats);
      if (isNaN(parsedSeats)) {
        return res.status(400).json({ error: "Invalid seats value" });
      }

      flights = await Flight.find({
        from,
        to,
        departureTime: parsedDepartureTime,
        seatsAvailable: { $gte: parsedSeats }
      });
    }

    res.json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ error: "An error occurred while fetching flights" });
  }
};

const postFlightController = async (req, res) => {
  try {
    if (!req.user || !req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newFlight = new Flight(req.body);
    await newFlight.save();

    res.status(201).json({ message: 'Flight created successfully', flight: newFlight });
  } catch (err) {
    console.error("Error creating flight:", err);
    if (err.code === 11000) {
      res.status(409).json({ error: "Flight with this number already exists" });
    } else {
      res.status(500).json({ error: "An error occurred while creating the flight" });
    }
  }
};

const putFlightController = async (req, res) => {
  try {
    if (!req.user || !req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { flightNumber, ...updates } = req.body;

    const flight = await Flight.findOneAndUpdate(
      { flightNumber },
      { $set: updates },
      { new: true }
    );

    if (!flight) {
      return res.status(404).json({ error: "Flight not found" });
    }

    res.json({ message: 'Flight updated successfully', flight });
  } catch (err) {
    console.error("Error updating flight:", err);
    res.status(500).json({ error: "An error occurred while updating the flight" });
  }
};

const deleteFlightController = async (req, res) => {
  try {
    if (!req.user || !req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { flightNumber } = req.body;
    
    const result = await Flight.deleteOne({ flightNumber });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Flight not found" });
    }

    res.json({ message: "Flight deleted successfully" });
  } catch (err) {
    console.error("Error deleting flight:", err);
    res.status(500).json({ error: "An error occurred while deleting the flight" });
  }
};

module.exports = {
  getFlightController,
  postFlightController,
  putFlightController,
  deleteFlightController
};