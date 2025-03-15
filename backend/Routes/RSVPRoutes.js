const { createRSVPResponse, getRSVPsByEventId } = require('../Controllers/RSVPController');
const { getAllRSVPs } = require('../Controllers/RSVPController');
const router = require('express').Router();

router.post('/', createRSVPResponse);
router.get('/', getAllRSVPs);

module.exports = router;