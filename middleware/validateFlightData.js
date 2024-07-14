const validateFlightData = (req, res, next) => {
    const { flightNumber, airline, from, to, departureTime, arrivalTime, duration } = req.body;
    
    if (!flightNumber) {
      return res.status(400).json({ error: 'flightNumber is required' });
    }
    if (!airline) {
      return res.status(400).json({ error: 'airline is required' });
    }
    if (!from) {
      return res.status(400).json({ error: 'from is required' });
    }
    if (!to) {
      return res.status(400).json({ error: 'to is required' });
    }
    if (!departureTime) {
      return res.status(400).json({ error: 'departureTime is required' });
    }
    if (!arrivalTime) {
      return res.status(400).json({ error: 'arrivalTime is required' });
    }
    if (!duration) {
      return res.status(400).json({ error: 'duration is required' });
    }
  
    next();
  };

  const validateFlightNumber = (req, res, next) => {
    const { flightNumber } = req.body;
    
    if (!flightNumber) {
      return res.status(400).json({ error: 'flightNumber is required' });
    }
  
    next();
  };
  

  module.exports = {validateFlightData, validateFlightNumber}