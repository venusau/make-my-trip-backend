const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Load environment variables
const connectionString = process.env.DATABASE_URI;
const PORT = process.env.PORT || 5000; // Use PORT environment variable or default to 5000

// Connect to MongoDB using Mongoose
mongoose
  .connect(connectionString)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log("Error in Connection", err));

// Middleware
server.use(express.json());
server.use(cors());

// Import models
require("./models/user.models");

// Import routes
const auth = require("./routes/auth.routes");
const flight = require("./routes/flight.routes");
const hotel = require("./routes/hotel.routes")

// Use routes
server.use(auth);
server.use(flight);
server.use(hotel)

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port number: ${PORT}`);
});
