const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Load environment variables
const connectionString = process.env.DATABASE_URI;

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

// Use routes
server.use(auth);
server.use(flight);

// Start the server
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server listening on port number: ${PORT}`);
});
