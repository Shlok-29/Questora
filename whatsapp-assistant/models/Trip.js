const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['UPCOMING', 'ACTIVE', 'COMPLETED'], default: 'UPCOMING' },
  destination: { type: String, required: true },
  check_in_date: { type: Date, required: true },
  check_out_date: { type: Date, required: true },
  hotel: {
    name: { type: String },
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    phone: { type: String },
    image: { type: String }
  },
  budget: {
    total_initial: { type: Number, required: true },
    pre_booked_expenses: { type: Number, default: 0 },
    wallet_remaining: { type: Number },
    daily_limit: { type: Number }
  },
  trip_data: {
    members: { type: Number, default: 1 },
    activities: [{ type: mongoose.Schema.Types.Mixed }],
    total_activities_cost: { type: Number, default: 0 },
    total_hotel_cost: { type: Number, default: 0 },
    grand_total: { type: Number, default: 0 }
  },
  whatsapp_session_active: { type: Boolean, default: false },
  welcome_sent: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', tripSchema);