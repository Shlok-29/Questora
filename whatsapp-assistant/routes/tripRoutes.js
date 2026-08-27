const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Initialize trip after payment (called from web platform)
router.post('/initialize', tripController.initializeTrip);

// Get trip details
router.get('/:tripId', tripController.getTrip);

// Update budget
router.patch('/:tripId/budget', tripController.updateBudget);

// Get user trips by phone
router.get('/user/:phone', tripController.getUserTrips);

module.exports = router;