const cron = require('node-cron');
const ItineraryItem = require('../models/ItineraryItem');
const Trip = require('../models/Trip');
const twilioService = require('./twilioService');
const weatherService = require('./weatherService');

class CronService {
  start() {
    // Run every hour to check for upcoming activities
    cron.schedule('0 * * * *', async () => {
      console.log('Running hourly activity check...');
      await this.checkUpcomingActivities();
    });

    // Run daily at 6 AM for weather alerts
    cron.schedule('0 6 * * *', async () => {
      console.log('Running daily weather check...');
      await this.checkWeatherAlerts();
    });

    // Run every 15 minutes to activate trips (check_in_date reached)
    cron.schedule('*/15 * * * *', async () => {
      await this.activateUpcomingTrips();
    });

    console.log('Cron jobs scheduled');
  }

  async checkUpcomingActivities() {
    try {
      // Find activities starting in next 30 minutes that haven't been notified
      const now = new Date();
      const thirtyMinsLater = new Date(now.getTime() + 30 * 60 * 1000);

      const upcomingItems = await ItineraryItem.find({
        time: { $gte: now, $lte: thirtyMinsLater },
        notification_sent: false
      }).populate('trip_id');

      for (const item of upcomingItems) {
        if (!item.trip_id || item.trip_id.status !== 'ACTIVE') continue;

        const trip = item.trip_id;
        const userPhone = `whatsapp:+91${trip.user_id.phone_number}`;

        // Send reminder
        await twilioService.sendScheduleReminder(userPhone, {
          title: item.title,
          location_name: item.location_name,
          estimated_cost: item.estimated_cost,
          weather_alert: false
        }, trip);

        // Mark as notified
        await ItineraryItem.findByIdAndUpdate(item._id, { notification_sent: true });
      }

    } catch (error) {
      console.error('Error checking upcoming activities:', error);
    }
  }

  async checkWeatherAlerts() {
    try {
      // Get all active trips
      const activeTrips = await Trip.find({ status: 'ACTIVE' });

      for (const trip of activeTrips) {
        if (!trip.hotel?.lat || !trip.hotel?.lng) continue;

        // Get outdoor activities for today
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const todayEnd = new Date(today.setHours(23, 59, 59, 999));

        const todayActivities = await ItineraryItem.find({
          trip_id: trip._id,
          time: { $gte: todayStart, $lte: todayEnd },
          type: 'OUTDOOR',
          status: 'PENDING'
        });

        for (const activity of todayActivities) {
          const weather = await weatherService.checkWeatherAndAdvise(
            trip.hotel.lat,
            trip.hotel.lng,
            activity.type
          );

          if (weather.alert) {
            // Update activity status
            await ItineraryItem.findByIdAndUpdate(activity._id, {
              status: 'WEATHER_ALERT'
            });

            // Get user phone
            const user = await require('../models/User').findById(trip.user_id);
            if (user) {
              await twilioService.sendWeatherAlert(
                `whatsapp:+91${user.phone_number}`,
                activity,
                weather,
                weather.alternatives
              );
            }
          }
        }
      }

    } catch (error) {
      console.error('Error checking weather alerts:', error);
    }
  }

  async activateUpcomingTrips() {
    try {
      const now = new Date();

      // Find trips where check_in_date is today and status is UPCOMING
      const tripsToActivate = await Trip.find({
        status: 'UPCOMING',
        check_in_date: { $lte: now }
      }).populate('user_id');

      for (const trip of tripsToActivate) {
        await Trip.findByIdAndUpdate(trip._id, {
          status: 'ACTIVE'
        });

        console.log(`Activated trip ${trip._id} to ${trip.destination}`);
      }

    } catch (error) {
      console.error('Error activating trips:', error);
    }
  }
}

module.exports = new CronService();