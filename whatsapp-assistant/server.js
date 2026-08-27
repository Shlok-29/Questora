const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Import routes
const webhookRoutes = require('./routes/webhookRoutes');
const tripRoutes = require('./routes/tripRoutes');

// Import services
const cronService = require('./services/cronService');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'WhatsApp Travel Assistant',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/v1/webhook', webhookRoutes);
app.use('/api/v1/trips', tripRoutes);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');

    // Start cron jobs
    cronService.start();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 WhatsApp Travel Assistant running on port ${PORT}`);
      console.log(`📱 Webhook URL: http://localhost:${PORT}/api/v1/webhook/twilio`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;