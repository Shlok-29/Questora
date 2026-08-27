const axios = require('axios');
require('dotenv').config();

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHERMAP_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getWeather(lat, lng) {
    try {
      if (!this.apiKey || this.apiKey === 'your_openweathermap_key') {
        return this.getMockWeather();
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      if (response.data) {
        return {
          condition: this.categorizeWeather(response.data.weather[0].main),
          temperature: Math.round(response.data.main.temp),
          humidity: response.data.main.humidity,
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon,
          city: response.data.name,
          rain_possible: response.data.weather[0].main.toLowerCase().includes('rain') ||
                        response.data.weather[0].main.toLowerCase().includes('drizzle') ||
                        response.data.clouds.all > 70
        };
      }

      return this.getMockWeather();
    } catch (error) {
      console.error('Weather API error:', error.message);
      return this.getMockWeather();
    }
  }

  categorizeWeather(main) {
    const rainConditions = ['Rain', 'Drizzle', 'Thunderstorm', 'Shower'];
    const cloudConditions = ['Cloudy', 'Mist', 'Fog', 'Haze'];

    if (rainConditions.includes(main)) return 'RAIN';
    if (cloudConditions.includes(main)) return 'CLOUDY';
    return 'CLEAR';
  }

  getMockWeather() {
    const conditions = ['CLEAR', 'CLOUDY', 'RAIN'];
    const random = Math.floor(Math.random() * 3);
    return {
      condition: conditions[random],
      temperature: Math.floor(Math.random() * 20) + 20, // 20-40°C
      humidity: Math.floor(Math.random() * 40) + 40,
      description: conditions[random].toLowerCase(),
      rain_possible: conditions[random] === 'RAIN'
    };
  }

  async checkWeatherAndAdvise(lat, lng, activityType) {
    const weather = await this.getWeather(lat, lng);

    const isOutdoorActivity = ['OUTDOOR', 'TREKKING', 'BEACH'].includes(activityType?.toUpperCase());

    if (weather.rain_possible && isOutdoorActivity) {
      return {
        alert: true,
        message: `🌧️ Weather alert! ${weather.condition} weather expected. Your outdoor activity might be affected.`,
        condition: weather.condition,
        temperature: weather.temperature,
        alternatives: this.suggestIndoorAlternatives()
      };
    }

    return {
      alert: false,
      message: `Current weather: ${weather.description}, ${weather.temperature}°C`,
      condition: weather.condition,
      temperature: weather.temperature
    };
  }

  suggestIndoorAlternatives() {
    return [
      { name: 'Local Museum', type: 'INDOOR', estimated_cost: 0 },
      { name: 'Cafe Hopping', type: 'FOOD', estimated_cost: 200 },
      { name: 'Shopping Mall', type: 'MISC', estimated_cost: 500 },
      { name: 'Movie Theater', type: 'ENTERTAINMENT', estimated_cost: 400 }
    ];
  }
}

module.exports = new WeatherService();