const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'weekendwander_listings',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    },
  });
} else {
  // Fallback to memory storage if Cloudinary is not configured
  storage = multer.memoryStorage();
}

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload, isCloudinaryConfigured };
