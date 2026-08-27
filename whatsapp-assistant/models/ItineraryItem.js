const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
  trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  day_number: { type: Number, required: true },
  time: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['OUTDOOR', 'INDOOR', 'FOOD', 'TRAVEL'], required: true },
  location_name: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  estimated_cost: { type: Number, default: 0 },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'SKIPPED', 'WEATHER_ALERT'], default: 'PENDING' },
  notification_sent: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ItineraryItem', itineraryItemSchema);