const User = require('../models/User');
const Trip = require('../models/Trip');
const ItineraryItem = require('../models/ItineraryItem');
const ExpenseLog = require('../models/ExpenseLog');
const twilioService = require('../services/twilioService');

class TripController {
  // Initialize a new trip from web platform after payment
  async initializeTrip(req, res) {
    try {
      const {
        user_name,
        phone_number,
        destination,
        check_in_date,
        check_out_date,
        hotel,
        budget_total,
        activities,
        total_activities_cost,
        total_hotel_cost,
        grand_total,
        members
      } = req.body;

      // Find or create user
      let user = await User.findOne({ phone_number });
      if (!user) {
        user = await User.create({
          name: user_name || 'Traveler',
          phone_number
        });
      }

      // Calculate trip days and daily limit
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const tripDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

      // Calculate wallet remaining after pre-booked expenses
      const preBookedExpenses = total_activities_cost + total_hotel_cost;
      const walletRemaining = budget_total - preBookedExpenses;
      const dailyLimit = Math.floor(walletRemaining / tripDays);

      // Create trip
      const trip = await Trip.create({
        user_id: user._id,
        status: 'UPCOMING',
        destination,
        check_in_date: checkIn,
        check_out_date: checkOut,
        hotel: {
          name: hotel?.name || 'Hotel',
          address: hotel?.address || '',
          lat: hotel?.lat || 0,
          lng: hotel?.lng || 0,
          phone: hotel?.phone || '',
          image: hotel?.image || ''
        },
        budget: {
          total_initial: budget_total,
          pre_booked_expenses: preBookedExpenses,
          wallet_remaining: walletRemaining,
          daily_limit: dailyLimit
        },
        trip_data: {
          members: members || 1,
          activities: activities || [],
          total_activities_cost: total_activities_cost || 0,
          total_hotel_cost: total_hotel_cost || 0,
          grand_total: grand_total || budget_total
        },
        whatsapp_session_active: true
      });

      // Helper function for activity categorization
      const categorizeActivity = (category) => {
        const cat = (category || '').toLowerCase();
        if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe')) return 'FOOD';
        if (cat.includes('travel') || cat.includes('commute') || cat.includes('transport')) return 'TRAVEL';
        if (cat.includes('indoor') || cat.includes('museum') || cat.includes('mall')) return 'INDOOR';
        return 'OUTDOOR';
      };

      // Create initial itinerary items from activities
      if (activities && activities.length > 0) {
        const itineraryItems = activities.map((activity, index) => {
          const activityDate = new Date(checkIn);
          activityDate.setDate(activityDate.getDate() + Math.floor(index / 3)); // 3 activities per day
          activityDate.setHours(9 + (index % 3) * 4); // 9am, 1pm, 5pm slots

          return {
            trip_id: trip._id,
            day_number: Math.floor(index / 3) + 1,
            time: activityDate,
            title: activity.name,
            description: activity.description || '',
            type: categorizeActivity(activity.category || activity.type),
            location_name: activity.location || '',
            lat: activity.lat || 0,
            lng: activity.lng || 0,
            estimated_cost: activity.price || 0
          };
        });

        await ItineraryItem.insertMany(itineraryItems);
      }

      // Log initial booking expenses
      if (total_activities_cost > 0) {
        await ExpenseLog.create({
          trip_id: trip._id,
          amount: total_activities_cost,
          category: 'BOOKING',
          description: 'Activities booking',
          source: 'WEB'
        });
      }

      if (total_hotel_cost > 0) {
        await ExpenseLog.create({
          trip_id: trip._id,
          amount: total_hotel_cost,
          category: 'BOOKING',
          description: 'Hotel booking',
          source: 'WEB'
        });
      }

      // Send welcome WhatsApp message
      setTimeout(async () => {
        await twilioService.sendWelcomeMessage(`whatsapp:${phone_number}`, trip);

        // Update welcome sent status
        await Trip.findByIdAndUpdate(trip._id, { welcome_sent: true });
      }, 2000);

      res.status(201).json({
        success: true,
        message: 'Trip initialized successfully',
        data: {
          trip_id: trip._id,
          user_id: user._id,
          whatsapp_active: true,
          daily_limit: dailyLimit,
          wallet_remaining: walletRemaining
        }
      });

    } catch (error) {
      console.error('Trip initialization error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize trip',
        error: error.message
      });
    }
  }

  // Get trip details
  async getTrip(req, res) {
    try {
      const { tripId } = req.params;

      const trip = await Trip.findById(tripId).populate('user_id');

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      const itinerary = await ItineraryItem.find({ trip_id: tripId }).sort({ day_number: 1, time: 1 });
      const expenses = await ExpenseLog.find({ trip_id: tripId }).sort({ timestamp: -1 });

      res.json({
        success: true,
        data: {
          trip,
          itinerary,
          expenses
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trip',
        error: error.message
      });
    }
  }

  // Update budget (add money)
  async updateBudget(req, res) {
    try {
      const { tripId } = req.params;
      const { amount_to_add } = req.body;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      const newWallet = trip.budget.wallet_remaining + amount_to_add;
      const newTotal = trip.budget.total_initial + amount_to_add;

      await Trip.findByIdAndUpdate(tripId, {
        'budget.wallet_remaining': newWallet,
        'budget.total_initial': newTotal,
        'budget.daily_limit': Math.floor(newWallet / Math.ceil((trip.check_out_date - trip.check_in_date) / (1000 * 60 * 60 * 24)))
      });

      // Log the top-up
      await ExpenseLog.create({
        trip_id: tripId,
        amount: -amount_to_add, // Negative because it's added to wallet
        category: 'MISC',
        description: 'Budget top-up via WhatsApp',
        source: 'WHATSAPP'
      });

      res.json({
        success: true,
        message: 'Budget updated',
        data: { new_wallet: newWallet, new_total: newTotal }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update budget',
        error: error.message
      });
    }
  }

  // Get user's trips
  async getUserTrips(req, res) {
    try {
      const { phone } = req.params;

      const user = await User.findOne({ phone_number: phone });
      if (!user) {
        return res.json({ success: true, data: [] });
      }

      const trips = await Trip.find({ user_id: user._id })
        .sort({ created_at: -1 });

      res.json({
        success: true,
        data: trips
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trips',
        error: error.message
      });
    }
  }

  categorizeActivity(category) {
    const cat = (category || '').toLowerCase();
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe')) return 'FOOD';
    if (cat.includes('travel') || cat.includes('commute') || cat.includes('transport')) return 'TRAVEL';
    if (cat.includes('indoor') || cat.includes('museum') || cat.includes('mall')) return 'INDOOR';
    return 'OUTDOOR';
  }
}

module.exports = new TripController();