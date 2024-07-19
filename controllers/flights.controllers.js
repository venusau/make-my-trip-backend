const Flight = require("../models/flight.models");


const getFlightController = async (req, res) => {
  const { from, to, departureTime, seats } = req.query;
  console.log(req.query);
  
  try {
    let flights = [];

    if (req.user && req.isAdmin) {
      flights = await Flight.find({});
      console.log("Admin fetching all flights", flights.length);
    } else {
      if (!from || !to || !departureTime || !seats) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Parse the date, ignoring the time component
      const parsedDepartureDate = new Date(departureTime.split('T')[0]);
      if (isNaN(parsedDepartureDate.getTime())) {
        return res.status(400).json({ error: "Invalid departure date format" });
      }

      // Set the time to the start of the day in UTC
      const startOfDay = new Date(parsedDepartureDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      // Set the end of the day
      const endOfDay = new Date(parsedDepartureDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const parsedSeats = parseInt(seats);
      if (isNaN(parsedSeats)) {
        return res.status(400).json({ error: "Invalid seats value" });
      }

      flights = await Flight.find({
        from,
        to,
        departureTime: {
          $gte: startOfDay,
          $lt: endOfDay
        },
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

    const flightData = { ...req.body };
    if (flightData.departureTime) {
      flightData.departureTime = new Date(flightData.departureTime);
    }

    const newFlight = new Flight(flightData);
    await newFlight.save();

    res.status(201).json({ message: 'Flight created successfully', flight: newFlight });
  } catch (err) {
    console.error("Error creating flight:", err);
    if (err.code === 11000) {
      res.status(409).json({ error: "Flight with this number already exists" });
    } else {
      res.status(500).json({ error: "An error occurred while creating the flight", message:err.message });
    }
  }
};

const putFlightController = async (req, res) => {
  try {
    if (!req.user || !req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { flightNumber, ...updates } = req.body;

    if (updates.departureTime) {
      updates.departureTime = new Date(updates.departureTime);
    }

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