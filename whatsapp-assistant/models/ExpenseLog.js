const mongoose = require('mongoose');

const expenseLogSchema = new mongoose.Schema({
  trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  timestamp: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  category: { type: String, enum: ['FOOD', 'TRAVEL', 'MISC', 'BOOKING'], required: true },
  description: { type: String },
  location: { type: String },
  source: { type: String, enum: ['WHATSAPP', 'WEB', 'AUTO'], default: 'WHATSAPP' }
});

module.exports = mongoose.model('ExpenseLog', expenseLogSchema);