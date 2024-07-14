const express = require("express");

const flightRouter = express.Router();
const requireSignin = require("../middleware/requireSignin");
const requireAdmin = require("../middleware/requireAdmin");
const Flight = require("../models/flight.models");
const { getFlightController, postFlightController, putFlightController, deleteFlightController } = require("../controllers/flights.controllers");


// Custom validation middleware
const {validateFlightData, validateFlightNumber} = require("../middleware/validateFlightData")

// GET Route 
flightRouter.get("/api/flight", requireSignin, getFlightController);

// Post flight route - for admin only
flightRouter.post(
  "/api/flight",
  requireSignin,
  validateFlightData,
  postFlightController
);


// Put flight Route - for admin only 
flightRouter.put(
  "/api/flight",
  requireSignin,
  validateFlightNumber,
  putFlightController
);

flightRouter.delete("/api/flight", requireSignin, deleteFlightController);

module.exports = flightRouter;
