const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Location Details
  location: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String },
  state: { type: String, required: true },
  pincode: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  
  // Search optimization fields
  lowercaseLocation: { type: String },
  lowercaseCity: { type: String },

  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Stay', 'Transport', 'Activities', 'Food', 'Homestay', 'LocalGuide'] 
  },
  subCategory: { type: String },
  
  contact: { type: String, required: true },
  ownerName: { type: String, required: true },
  
  // Property Features
  facilities: [{ type: String }],
  maxGuests: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },

  // Guide Features
  specialization: { type: String },
  languagesSpoken: [{ type: String }],
  yearsOfExperience: { type: Number },
  
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);
