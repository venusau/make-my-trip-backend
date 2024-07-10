const express = require("express");

const flightRouter = express.Router();
const requireSignin = require("../middleware/requireSignin");
const requireAdmin = require("../middleware/requireAdmin");
const Flight = require("../models/flight.models");
const { body, validationResult } = require("express-validator");
const { getFlightController, postFlightController, putFlightController, deleteFlightController } = require("../controllers/flights.controllers");


// GET Route 
flightRouter.get("/api/flight", requireSignin, getFlightController);


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
  postFlightController
);


flightRouter.put(
  "/api/flight",
  [
    requireSignin,
    body('flightNumber').notEmpty().withMessage('flightNumber is required')
  ],
  putFlightController
);


flightRouter.delete("/api/flight", requireSignin, deleteFlightController )

module.exports = flightRouter;
