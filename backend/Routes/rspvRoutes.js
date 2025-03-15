// routes/rsvpRoutes.js
const express = require('express');
const router = express.Router();
const RSVPResponse = require('../models/RSVPResponse');

// Submit RSVP
router.post('/api/rsvp', async (req, res) => {
  try {
    const { eventId, name, email, phone, response } = req.body;
    
    const newRSVP = new RSVPResponse({
      eventId,
      name,
      email,
      phone,
      response
    });

    await newRSVP.save();
    
    res.status(201).json({ message: 'RSVP submitted successfully' });
  } catch (error) {
    console.error('RSVP submission error:', error);
    res.status(500).json({ message: 'Failed to submit RSVP' });
  }
});

// Get RSVPs for an event
router.get('/api/rsvp/:eventId', async (req, res) => {
  try {
    const rsvps = await RSVPResponse.find({ eventId: req.params.eventId });
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch RSVPs' });
  }
});

module.exports = router;