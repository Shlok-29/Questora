const axios = require('axios');
require('dotenv').config();

class DistanceService {
  constructor() {
    this.apiKey = process.env.GOOGLE_DISTANCE_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';

    // Local transport rates (INR per km)
    this.transportRates = {
      auto: { base: 30, per_km: 10 },
      rickshaw: { base: 20, per_km: 8 },
      cab: { base: 50, per_km: 14 },
      bike: { base: 15, per_km: 6 }
    };
  }

  async getDistanceAndTime(origin, destination) {
    try {
      if (!this.apiKey || this.apiKey === 'your_google_distance_key') {
        return this.getMockDistance(origin, destination);
      }

      const response = await axios.get(this.baseUrl, {
        params: {
          origins: `${origin.lat},${origin.lng}`,
          destinations: `${destination.lat},${destination.lng}`,
          mode: 'driving',
          key: this.apiKey
        }
      });

      if (response.data.rows && response.data.rows[0]?.elements) {
        const element = response.data.rows[0].elements[0];
        if (element.status === 'OK') {
          return {
            distance_km: element.distance.value / 1000,
            duration_minutes: Math.round(element.duration.value / 60),
            distance_text: element.distance.text,
            duration_text: element.duration.text
          };
        }
      }

      return this.getMockDistance(origin, destination);
    } catch (error) {
      console.error('Distance Matrix error:', error.message);
      return this.getMockDistance(origin, destination);
    }
  }

  estimateAutoFare(distance_km) {
    const rate = this.transportRates.auto;
    const fare = rate.base + (distance_km * rate.per_km);
    return Math.round(fare / 10) * 10; // Round to nearest 10
  }

  async getFareEstimate(origin, destination, transportType = 'auto') {
    const distanceData = await this.getDistanceAndTime(origin, destination);
    const rate = this.transportRates[transportType] || this.transportRates.auto;

    const estimatedFare = rate.base + (distanceData.distance_km * rate.per_km);

    return {
      ...distanceData,
      estimated_fare: Math.round(estimatedFare / 10) * 10,
      transport_type: transportType,
      fare_range: `₹${Math.round(estimatedFare * 0.8 / 10) * 10}-₹${Math.round(estimatedFare * 1.2 / 10) * 10}`
    };
  }

  getMockDistance(origin, destination) {
    // Calculate rough distance from coordinates
    const latDiff = Math.abs(destination.lat - origin.lat);
    const lngDiff = Math.abs(destination.lng - origin.lng);
    const distance_km = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // rough conversion

    return {
      distance_km: Math.round(distance_km * 10) / 10,
      duration_minutes: Math.round(distance_km * 3),
      distance_text: `${Math.round(distance_km * 10) / 10} km`,
      duration_text: `${Math.round(distance_km * 3)} mins`
    };
  }
}

module.exports = new DistanceService();