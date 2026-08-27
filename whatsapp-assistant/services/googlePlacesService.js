const axios = require('axios');
require('dotenv').config();

class GooglePlacesService {
  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  async searchNearby(lat, lng, type = 'restaurant', maxPrice = 4, radius = 2000) {
    try {
      // If no API key, return mock data
      if (!this.apiKey || this.apiKey === 'your_google_places_key') {
        return this.getMockPlaces(lat, lng, type);
      }

      const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
        params: {
          location: `${lat},${lng}`,
          radius,
          type,
          maxprice: maxPrice,
          opennow: true,
          key: this.apiKey
        }
      });

      if (response.data.results) {
        return response.data.results.slice(0, 5).map(place => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          rating: place.rating || 0,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          price_level: place.price_level || 2,
          types: place.types
        }));
      }

      return [];
    } catch (error) {
      console.error('Google Places error:', error.message);
      return this.getMockPlaces(lat, lng, type);
    }
  }

  async searchPlaces(query, location) {
    try {
      if (!this.apiKey || this.apiKey === 'your_google_places_key') {
        return this.getMockPlaces(location.lat, location.lng, 'restaurant');
      }

      const response = await axios.get(`${this.baseUrl}/place/textsearch/json`, {
        params: {
          query,
          location: `${location.lat},${location.lng}`,
          key: this.apiKey
        }
      });

      if (response.data.results) {
        return response.data.results.slice(0, 5).map(place => ({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address || place.vicinity,
          rating: place.rating || 0,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          price_level: place.price_level || 2
        }));
      }

      return [];
    } catch (error) {
      console.error('Google Places search error:', error.message);
      return [];
    }
  }

  getMockPlaces(lat, lng, type) {
    return [
      {
        id: 'mock_1',
        name: 'Local Dhaba',
        address: 'Near main road, 500m',
        rating: 4.2,
        lat: lat + 0.002,
        lng: lng + 0.001,
        price_level: 1,
        types: ['restaurant']
      },
      {
        id: 'mock_2',
        name: 'Budget Hotel Restaurant',
        address: 'Hotel complex, 1km',
        rating: 4.0,
        lat: lat - 0.001,
        lng: lng + 0.002,
        price_level: 2,
        types: ['restaurant']
      },
      {
        id: 'mock_3',
        name: 'Street Food Corner',
        address: 'Market area, 800m',
        rating: 4.5,
        lat: lat + 0.003,
        lng: lng - 0.001,
        price_level: 0,
        types: ['food']
      }
    ];
  }
}

module.exports = new GooglePlacesService();