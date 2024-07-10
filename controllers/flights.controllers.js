const Flight = require("../models/flight.models");
const { body, validationResult } = require("express-validator");


const getFlightController = async (req, res) => {
    const { from, to, departureTime, returnTime, seats } = req.query;
  
    if (!from || !to || !departureTime || !seats) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    if (!req.user) {
      return res.status(401).json({ error: "You are not logged in" });
    }
  
    try {
      // Parse departureTime into a Date object
      const parsedDepartureTime = new Date(departureTime);
      const flights = await Flight.find({ from, to, departureTime: parsedDepartureTime });
      
      let flights_response = [];
  
      for (let flight of flights) {
        if (flight.seatsAvailable >= parseInt(seats)) {
          flights_response.push(flight);
        }
      }
  
      res.json(flights_response);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching flights" });
    }
  }

const postFlightController = async (req, res) => {
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

const putFlightController = async (req, res) => {
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
const deleteFlightController = async(req, res)=>{
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

}
  module.exports = {getFlightController, postFlightController, putFlightController, deleteFlightController}