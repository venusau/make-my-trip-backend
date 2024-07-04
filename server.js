const express = require("express")
const server = express()
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const connectionString = process.env.DATABASE_URI
require("./models/user.models");

mongoose
  .connect(connectionString)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log("Error in Connection ", err));


server.use(express.json())
server.use(cors());
const auth = require("./routes/auth.routes")
const flight = require("./routes/flight.routes")

server.use(auth)
server.use(flight)



const PORT = 5001
server.listen(PORT, ()=>{
    console.log(`Server listening on port number : ${PORT}`)
})

