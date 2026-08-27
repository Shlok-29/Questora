const express = require('express');
const router = express.Router();
const util = require('util');
const Listing = require('../models/Listing');
const { upload, isCloudinaryConfigured } = require('../config/cloudinary');

// @route   POST api/listings
// @desc    Create a new property listing with images (Multipart/FormData)
router.post('/', (req, res) => {
  upload.array('images', 5)(req, res, async (err) => {
    if (err) {
      console.error("❌ MULTER/CLOUDINARY ERROR:", err);
      return res.status(400).json({ 
        message: "Image upload failed. Please check your image formats or Cloudinary settings.", 
        error: err.message 
      });
    }

    try {
      console.log("--------------------------------------------------");
      console.log("📩 NEW LISTING REQUEST RECEIVED");
      console.log("📦 RAW BODY:", JSON.stringify(req.body, null, 2));
      console.log("🖼️  FILES COUNT:", req.files ? req.files.length : 0);

      const { 
        title, description, location, city, district, state, pincode, latitude, longitude,
        price, category, subCategory, contact, ownerName,
        facilities, maxGuests, bedrooms, bathrooms,
        specialization, languagesSpoken, yearsOfExperience
      } = req.body;

      // Parse languagesSpoken if passed as JSON or comma-separated string
      let parsedLanguages = [];
      if (languagesSpoken) {
        try {
          parsedLanguages = typeof languagesSpoken === 'string' ? JSON.parse(languagesSpoken) : languagesSpoken;
        } catch (e) {
          parsedLanguages = typeof languagesSpoken === 'string' ? languagesSpoken.split(',').map(s => s.trim()) : [languagesSpoken];
        }
      }

      // Normalize and convert data
      const normalizedData = {
        title,
        description,
        location,
        city,
        district,
        state,
        pincode,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        lowercaseLocation: location ? location.toLowerCase().trim() : "",
        lowercaseCity: city ? city.toLowerCase().trim() : "",
        price: price ? Number(price) : 0,
        category: category || "Homestay",
        subCategory: subCategory || (category === "LocalGuide" ? "guide" : "home"),
        contact,
        ownerName,
        maxGuests: maxGuests ? Number(maxGuests) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        specialization,
        languagesSpoken: parsedLanguages,
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
      };

      // Handle Image Paths
      let imageUrls = [];
      if (isCloudinaryConfigured && req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => file.path || file.secure_url);
      } else if (req.files && req.files.length > 0) {
        const mockImages = [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400",
          "https://images.unsplash.com/photo-1600607687931-cebf5871c0eb?w=1400"
        ];
        imageUrls = req.files.map((_, i) => mockImages[i % mockImages.length]);
      }

      // Handle Facilities
      let parsedFacilities = [];
      if (facilities) {
        try {
          parsedFacilities = JSON.parse(facilities);
        } catch (e) {
          parsedFacilities = Array.isArray(facilities) ? facilities : [facilities];
        }
      }

      const newListing = new Listing({
        ...normalizedData,
        facilities: parsedFacilities,
        images: imageUrls
      });

      const savedListing = await newListing.save();
      console.log("✅ LISTING SAVED SUCCESSFULLY:", savedListing._id);
      res.status(201).json(savedListing);

    } catch (dbErr) {
      console.error("❌ DATABASE ERROR:", dbErr);
      res.status(400).json({ 
        message: 'Failed to create listing', 
        error: dbErr.message,
        details: dbErr.errors
      });
    }
  });
});

// @route   GET api/listings
// @desc    Get all listings (Sorted by newest)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching listings', error: err.message });
  }
});

module.exports = router;
