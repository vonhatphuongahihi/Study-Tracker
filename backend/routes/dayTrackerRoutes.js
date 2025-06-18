const express = require('express');
const router = express.Router();
const dayTrackerController = require('../controllers/dayTrackerController');

router.get('/current', dayTrackerController.getCurrentDay);
router.post('/increment', dayTrackerController.incrementDay);

module.exports = router; 