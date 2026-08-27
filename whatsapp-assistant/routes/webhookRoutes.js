const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Twilio webhook - incoming messages
router.post('/twilio', webhookController.handleIncomingMessage);

// Health check for webhook
router.get('/twilio', (req, res) => {
  res.send('Webhook is active!');
});

module.exports = router;