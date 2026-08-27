const User = require('../models/User');
const Trip = require('../models/Trip');
const ItineraryItem = require('../models/ItineraryItem');
const ExpenseLog = require('../models/ExpenseLog');
const twilioService = require('../services/twilioService');
const aiService = require('../services/aiService');
const googlePlacesService = require('../services/googlePlacesService');
const distanceService = require('../services/distanceService');
const weatherService = require('../services/weatherService');

class WebhookController {
  // Handle incoming WhatsApp messages
  async handleIncomingMessage(req, res) {
    // Immediately respond to Twilio to avoid timeout (15 seconds)
    res.sendStatus(200);

    const { From, Body, SmsMessageSid, ProfileName } = req.body;

    console.log(`📩 Incoming message from ${From}: ${Body}`);
    console.log(`Message SID: ${SmsMessageSid}`);

    try {
      // Process message asynchronously
      this.processMessage(From, Body, ProfileName, SmsMessageSid);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  async processMessage(from, body, messageSid, profileName) {
    // Find user and active trip
    const phone = from.replace('whatsapp:', '');
    const user = await User.findOne({ phone_number: phone });

    if (!user) {
      await twilioService.sendWhatsAppMessage(
        from,
        `Hi! I don't recognize this number. Please book a trip through our website first: ${process.env.FRONTEND_URL}`
      );
      return;
    }

    const trip = await Trip.findOne({
      user_id: user._id,
      status: { $in: ['UPCOMING', 'ACTIVE'] }
    });

    if (!trip) {
      await twilioService.sendTripExpired(from, process.env.FRONTEND_URL);
      return;
    }

    // Check for trip expiry (check_out_date + 24 hours)
    const expiryTime = new Date(trip.check_out_date);
    expiryTime.setHours(expiryTime.getHours() + 24);

    if (new Date() > expiryTime) {
      await Trip.findByIdAndUpdate(trip._id, { status: 'COMPLETED', whatsapp_session_active: false });
      await twilioService.sendTripExpired(from, process.env.FRONTEND_URL);
      return;
    }

    // Check for duplicate message (idempotency)
    const existingLog = await ExpenseLog.findOne({ description: `msg_${messageSid}` });
    if (existingLog) {
      console.log(`Duplicate message detected: ${messageSid}`);
      return;
    }

    // Classify intent
    const intent = await aiService.classifyIntent(body);
    console.log(`Intent classified: ${intent}`);

    // Route based on intent
    let response;

    switch (intent) {
      case 'FIND_FOOD':
        response = await this.handleFindFood(trip, user, body);
        break;

      case 'FIND_PLACE':
        response = await this.handleFindPlace(trip, user, body);
        break;

      case 'COMMUTE_INQUIRY':
        response = await this.handleCommuteInquiry(trip, user, body);
        break;

      case 'WEATHER_CHECK':
        response = await this.handleWeatherCheck(trip, body);
        break;

      case 'EXPENSE_LOG':
        response = await this.handleExpenseLog(trip, user, body);
        break;

      case 'SCHEDULE_INQUIRY':
        response = await this.handleScheduleInquiry(trip);
        break;

      case 'BUDGET_CHECK':
        response = await this.handleBudgetCheck(trip);
        break;

      default:
        response = await this.handleGeneralChat(trip, user, body);
    }

    // Send AI response via Twilio
    await twilioService.sendWhatsAppMessage(from, response);
  }

  async handleFindFood(trip, user, userMessage) {
    const walletRemaining = trip.budget.wallet_remaining;
    const dailyLimit = trip.budget.daily_limit;

    // Determine max price based on budget
    let maxPrice = 4;
    if (walletRemaining < dailyLimit * 0.5) maxPrice = 2;
    if (walletRemaining < 500) maxPrice = 1;

    // Get hotel location or use destination center
    const lat = trip.hotel?.lat || 0;
    const lng = trip.hotel?.lng || 0;

    // Search for food places
    const places = await googlePlacesService.searchNearby(lat, lng, 'restaurant', maxPrice);

    if (places.length === 0) {
      return '🍽️ No nearby restaurants found matching your budget. Try expanding your search area or increasing budget.';
    }

    // Build user context for AI
    const userContext = {
      userName: user.name,
      destination: trip.destination,
      remainingBudget: walletRemaining,
      dailyLimit: dailyLimit,
      hotelLocation: trip.hotel?.name || '',
      activities: places,
      isEmergencyMode: walletRemaining < 200
    };

    // Generate AI response with place data
    const aiResponse = await aiService.generateResponse(
      [{ role: 'user', content: `User asked: "${userMessage}". Here are nearby food options within budget:\n${JSON.stringify(places, null, 2)}\n\nSuggest the best options considering remaining budget of ₹${walletRemaining}.` }],
      userContext
    );

    return aiResponse.success ? aiResponse.response : this.formatPlacesResponse(places);
  }

  async handleFindPlace(trip, user, userMessage) {
    const places = await googlePlacesService.searchPlaces(
      userMessage.replace(/find|search|look for/gi, ''),
      { lat: trip.hotel?.lat || 0, lng: trip.hotel?.lng || 0 }
    );

    if (places.length === 0) {
      return '🔍 No places found matching your search. Try a different query.';
    }

    return this.formatPlacesResponse(places);
  }

  async handleCommuteInquiry(trip, user, userMessage) {
    // Extract destination from message
    const destinationMatch = userMessage.match(/(?:to|from|go|destination)\s+([A-Za-z\s]+)/i);
    const destinationName = destinationMatch ? destinationMatch[1].trim() : trip.destination;

    const origin = {
      lat: trip.hotel?.lat || 0,
      lng: trip.hotel?.lng || 0
    };

    // Mock destination coordinates based on destination name
    const destination = this.getMockCoordinates(destinationName);

    const fareData = await distanceService.getFareEstimate(origin, destination);

    const userContext = {
      userName: user.name,
      destination: trip.destination,
      remainingBudget: trip.budget.wallet_remaining,
      dailyLimit: trip.budget.daily_limit
    };

    const aiResponse = await aiService.generateResponse(
      [{ role: 'user', content: `User asked: "${userMessage}". Distance to ${destinationName} is ${fareData.distance_text}, estimated time: ${fareData.duration_text}, auto fare: ${fareData.fare_range}. Suggest the best transport option.` }],
      userContext
    );

    return aiResponse.success ? aiResponse.response :
      `🚗 *Transport to ${destinationName}*\nDistance: ${fareData.distance_text}\n⏱️ Time: ${fareData.duration_text}\n💰 Est. auto fare: ${fareData.fare_range}`;
  }

  async handleWeatherCheck(trip, userMessage) {
    const lat = trip.hotel?.lat || 0;
    const lng = trip.hotel?.lng || 0;

    const weather = await weatherService.getWeather(lat, lng);

    const emoji = weather.condition === 'RAIN' ? '🌧️' :
                  weather.condition === 'CLOUDY' ? '☁️' : '☀️';

    return `${emoji} *Weather in ${trip.destination}*\n🌡️ Temperature: ${weather.temperature}°C\n📝 Condition: ${weather.description}\n${weather.rain_possible ? '⚠️ Rain possible - pack an umbrella!' : '✅ Clear skies!'}`;
  }

  async handleExpenseLog(trip, user, userMessage) {
    // Extract amount from message
    const amountMatch = userMessage.match(/₹?(\d+)/);
    const amount = amountMatch ? parseInt(amountMatch[1]) : 0;

    if (amount <= 0) {
      return '💰 Could not detect expense amount. Please mention the amount clearly (e.g., "₹200 for auto").';
    }

    // Update wallet
    const newBalance = trip.budget.wallet_remaining - amount;

    // Log expense
    await ExpenseLog.create({
      trip_id: trip._id,
      amount,
      category: 'MISC',
      description: userMessage.substring(0, 100),
      source: 'WHATSAPP'
    });

    // Update trip wallet
    await Trip.findByIdAndUpdate(trip._id, {
      'budget.wallet_remaining': newBalance
    });

    // Check for emergency mode
    if (newBalance < 200 && trip.budget.wallet_remaining >= 200) {
      await twilioService.sendEmergencyMode(`whatsapp:${user.phone_number}`);
    }

    return `✅ *Expense logged!*\n💸 Amount: ₹${amount.toLocaleString('en-IN')}\n💰 New balance: ₹${newBalance.toLocaleString('en-IN')}\n${newBalance < 0 ? '⚠️ Warning: Over budget!' : ''}`;
  }

  async handleScheduleInquiry(trip) {
    const items = await ItineraryItem.find({ trip_id: trip._id })
      .sort({ day_number: 1, time: 1 })
      .limit(5);

    if (items.length === 0) {
      return '📅 No activities scheduled yet. Add activities on the website!';
    }

    const response = items.map(item => {
      const time = new Date(item.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const emoji = item.type === 'FOOD' ? '🍽️' :
                   item.type === 'TRAVEL' ? '🚗' :
                   item.type === 'OUTDOOR' ? '🌅' : '🏠';
      return `${emoji} *Day ${item.day_number}* - ${time}\n${item.title}`;
    }).join('\n\n');

    return `📅 *Your Itinerary:*\n\n${response}`;
  }

  async handleBudgetCheck(trip) {
    const { wallet_remaining, daily_limit, total_initial } = trip.budget;
    const spent = total_initial - wallet_remaining;
    const percentUsed = Math.round((spent / total_initial) * 100);

    return `💰 *Budget Check*\n📊 Total: ₹${total_initial.toLocaleString('en-IN')}\n✅ Spent: ₹${spent.toLocaleString('en-IN')}\n💵 Remaining: ₹${wallet_remaining.toLocaleString('en-IN')}\n📅 Today's limit: ₹${daily_limit.toLocaleString('en-IN')}\n${percentUsed > 80 ? '⚠️ You\'ve used ' + percentUsed + '% of budget!' : '✅ Budget on track!'}`;
  }

  async handleGeneralChat(trip, user, userMessage) {
    const userContext = {
      userName: user.name,
      destination: trip.destination,
      remainingBudget: trip.budget.wallet_remaining,
      dailyLimit: trip.budget.daily_limit,
      hotelLocation: trip.hotel?.name || '',
      isEmergencyMode: trip.budget.wallet_remaining < 200
    };

    const aiResponse = await aiService.generateResponse(
      [{ role: 'user', content: userMessage }],
      userContext
    );

    return aiResponse.success ? aiResponse.response :
      '🤔 Sorry, I didn\'t understand that. Try asking about food, weather, budget, or your schedule!';
  }

  formatPlacesResponse(places) {
    return places.map((place, index) => {
      const priceEmoji = place.price_level <= 1 ? '💰' :
                         place.price_level === 2 ? '💰💰' : '💰💰💰';
      const ratingEmoji = place.rating >= 4.5 ? '⭐' : place.rating >= 4 ? '⭐⭐' : '⭐';
      return `${index + 1}. *${place.name}*\n📍 ${place.address}\n${ratingEmoji} ${place.rating} ${priceEmoji}`;
    }).join('\n\n');
  }

  getMockCoordinates(placeName) {
    // This would normally use Google Geocoding API
    // For now, return slight offset from hotel
    return {
      lat: 31.5 + Math.random() * 0.1,
      lng: 77.0 + Math.random() * 0.1
    };
  }
}

module.exports = new WebhookController();