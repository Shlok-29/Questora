const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  type: {
    type: String, // 'hotel', 'activity'
    required: true,
  },
  destinationId: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  quantityBooked: {
    type: Number,
    required: true,
    default: 1,
  },
  userPhoneNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
