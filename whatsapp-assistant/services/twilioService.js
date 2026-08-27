const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio with API Key authentication
const client = twilio(
  process.env.TWILIO_API_KEY,
  process.env.TWILIO_API_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

class TwilioService {
  constructor() {
    this.fromNumber = process.env.TWILIO_WHATSAPP_FROM;
    console.log('Twilio client initialized with API Key auth');
  }

  async sendWhatsAppMessage(to, message) {
    try {
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      const formattedFrom = this.fromNumber.startsWith('whatsapp:') ? this.fromNumber : `whatsapp:${this.fromNumber}`;

      const result = await client.messages.create({
        body: message,
        from: formattedFrom,
        to: formattedTo
      });

      console.log(`WhatsApp message sent to ${to}: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('Twilio send error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeMessage(to, tripDetails) {
    const activitiesList = tripDetails.trip_data?.activities?.length > 0
      ? tripDetails.trip_data.activities.map(a => `• ${a.name}`).join('\n')
      : 'No activities selected yet.';

    const message = `🏖️ *Welcome to ${tripDetails.destination}!*

Hey! Your trip is all set. Here's your quick summary:
📍 *Hotel:* ${tripDetails.hotel?.name || 'Hotel'}
📅 *Check-in:* ${new Date(tripDetails.check_in_date).toLocaleDateString('en-IN')}
📅 *Check-out:* ${new Date(tripDetails.check_out_date).toLocaleDateString('en-IN')}
💰 *Budget:* ₹${tripDetails.budget.total_initial.toLocaleString('en-IN')}

🎟️ *Your Activities:*
${activitiesList}

I'm your travel assistant! Ask me anything - food, directions, weather, or budget check. 🚀`;

    return this.sendWhatsAppMessage(to, message);
  }

  async sendScheduleReminder(to, item) {
    const message = `⏰ *Reminder!*
Your "${item.title}" starts in 30 mins!
📍 ${item.location_name || 'Location pending'}
💰 Est. cost: ₹${item.estimated_cost || 0}
\nNeed directions? Just ask! 🚗`;

    return this.sendWhatsAppMessage(to, message);
  }

  async sendBudgetUpdate(to, remaining, daily_limit) {
    const message = `💰 *Budget Update*
Remaining: ₹${remaining.toLocaleString('en-IN')}
Today's limit: ₹${daily_limit.toLocaleString('en-IN')}
${remaining < daily_limit ? '✅ You\'re within budget!' : '⚠️ Over daily limit today.'}`;

    return this.sendWhatsAppMessage(to, message);
  }

  async sendEmergencyMode(to) {
    const message = `🚨 *Emergency Mode Activated*
Your wallet is low. I'm only suggesting free/budget activities now!

Free options:
🏞️ Local parks
🚶 Walking trails
🏛️ Free museums
🏺 Local markets

Need help planning? Just ask!`;

    return this.sendWhatsAppMessage(to, message);
  }

  async sendTripExpired(to, websiteUrl) {
    const message = `📝 *Trip Ended*
Your last trip has ended.

To plan a new adventure, visit: ${websiteUrl}

Thanks for traveling with us! 🌍`;

    return this.sendWhatsAppMessage(to, message);
  }
}

module.exports = new TwilioService();