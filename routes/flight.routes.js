const express = require("express");
const { body, validationResult } = require("express-validator");
const flightRouter = express.Router();
const requireSignin = require("../middleware/requireSignin");
const requireAdmin = require("../middleware/requireAdmin");
const Flight = require("../models/flight.models");

// Get flight route - for any logged-in user
const handleSearch = async (e) => {
  e.preventDefault();
  try {
    const queryParams = new URLSearchParams({
      from,
      to,
      departureTime: departureDate,
      returnTime: returnDate,
      seats: numberOfSeats,
    }).toString();

    const response = await fetch(`https://make-my-trip-backend.onrender.com/api/flight?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      }
    });

    const data = await response.json();
    setFlights(data);
  } catch (error) {
    console.log("Error fetching flights:", error);
  }
};

// Post flight route - for admin only
flightRouter.post(
  "/api/flight",
  [
    requireSignin,
    requireAdmin,
    body('flightNumber').notEmpty().withMessage('flightNumber is required'),
    body('airline').notEmpty().withMessage('airline is required'),
    body('from').notEmpty().withMessage('from is required'),
    body('to').notEmpty().withMessage('to is required'),
    body('departureTime').notEmpty().withMessage('departureTime is required'),
    body('arrivalTime').notEmpty().withMessage('arrivalTime is required'),
    body('duration').notEmpty().withMessage('duration is required'),

  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      flightNumber,
      airline,
      from,
      to,
      departureTime,
      arrivalTime,
      duration,
      price,
      seatsAvailable,
      seatType,
      status,
      createdAt,
      updatedAt
    } = req.body;

    try {
      // Create a new flight instance of mongoose Model `Flight`
      const newFlight = new Flight({
        flightNumber,
        airline,
        from,
        to,
        departureTime,
        arrivalTime,
        duration,
        price,
        seatsAvailable,
        seatType,
        status,
        createdAt,
        updatedAt
      });

      // Save the flight to the database
      await newFlight.save();

      // Send a success response
      res.status(201).json({ message: 'Flight created successfully', flight: newFlight });
    } catch (err) {
      // Handling errors
      console.error(err);
      res.status(500).json({ error: `Flight already exist ${err}` });
    }
  }
);


flightRouter.put(
  "/api/flight",
  [
    requireSignin,
    requireAdmin,
    body('flightNumber').notEmpty().withMessage('flightNumber is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { flightNumber, ...updates } = req.body;

    try {
      const flight = await Flight.findOne({ flightNumber });
      if (!flight) {
        return res.status(404).json({ error: "Flight does not exist" });
      }

      // Update the flight with the provided updates
      await Flight.updateOne({ flightNumber }, { $set: updates });

      // Fetch the updated flight
      const updatedFlight = await Flight.findOne({ flightNumber });

      // Send a success response
      res.status(200).json({ message: 'Flight updated successfully', flight: updatedFlight });
    } catch (err) {
      // Handling errors
      console.error(err);
      res.status(500).json({ error: `An error occurred while updating the flight: ${err.message}` });
    }
  }
);


flightRouter.delete("/api/flight", requireSignin, requireAdmin, async(req, res)=>{
  const { flightNumber } = req.body
  try{
  const flight = await Flight.findOne({flightNumber})
  if(!flight){
    return res.status(401).json({error:"FLight does not exist"})

  }
  await Flight.deleteOne({flightNumber})
  res.json({message:"Flight deleted successfully"})
}
catch(err){
  res.status(500).json({error:`An error occurred while deleting the flight: ${err}`})
}

})

module.exports = flightRouter;
