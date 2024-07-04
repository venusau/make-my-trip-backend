const express = require("express")
const hotelRouter = express.Router()
const requireSignin = require("../middleware/requireSignin");
const requireAdmin = require("../middleware/requireAdmin");
const Hotel = require("../models/hotel.models");


hotelRouter.get("/api/hotel", requireSignin, async(req, res)=>{
    const getDetails= req.body
    console.log(getDetails)
    try {
        const hotels = await Hotel.find({getDetails})
        if(!hotels){
            return res.status(500).json({error:"No hotels to show"})
        }
        return res.json({message:"Succesfully found the hotels", hotels})

    } catch (err) {
        return res.status(500).json({error:`Internal server Error: ${err}`})
        
    }

})

hotelRouter.post("/api/hotel", requireSignin, requireAdmin, async (req, res) => {
    try {
      const hotelDetails = req.body; // directly get the details from req.body
  
      const hotel = new Hotel(hotelDetails); // create a new Hotel instance
      await hotel.save(); // save the hotel to the database
  
      return res.status(201).json({ message: "Hotel created successfully", hotel });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  });
  




module.exports = hotelRouter