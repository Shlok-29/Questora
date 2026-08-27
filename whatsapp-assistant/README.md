# WhatsApp Travel Assistant

AI-powered travel assistant that operates directly on WhatsApp after booking confirmation.

## Features

- **Context-aware AI** powered by MiniMax m2.5
- **WhatsApp integration** via Twilio
- **Real-time weather alerts** with OpenWeatherMap
- **Google Places API** for nearby restaurants and attractions
- **Distance Matrix API** for commute fare estimates
- **Live budget tracking** with wallet deduction
- **Proactive schedule reminders** via cron jobs

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update `.env` with your API keys:
```env
MINIMAX_API_KEY=your_minimax_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
MONGO_URI=your_mongodb_uri
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### Webhook (Twilio)
- `POST /api/v1/webhook/twilio` - Receive WhatsApp messages
- `GET /api/v1/webhook/twilio` - Webhook health check

### Trips
- `POST /api/v1/trips/initialize` - Initialize trip after payment
- `GET /api/v1/trips/:tripId` - Get trip details
- `PATCH /api/v1/trips/:tripId/budget` - Update budget
- `GET /api/v1/trips/user/:phone` - Get user trips

## Initialize Trip Example

```json
POST /api/v1/trips/initialize
{
  "user_name": "Amit",
  "phone_number": "9999999999",
  "destination": "Goa",
  "check_in_date": "2026-06-15",
  "check_out_date": "2026-06-18",
  "hotel": {
    "name": "Beach Resort Goa",
    "lat": 15.4988,
    "lng": 73.8278
  },
  "budget_total": 30000,
  "activities": [
    {"name": "Water Sports", "price": 2000, "category": "Adventure"}
  ],
  "total_activities_cost": 2000,
  "total_hotel_cost": 12000,
  "grand_total": 14000,
  "members": 2
}
```

## Supported User Queries

| Intent | Example Query |
|--------|---------------|
| FIND_FOOD | "Nearby khaana?" / "Sasta khana?" |
| FIND_PLACE | "Nearby market?" / "Park kahan hai?" |
| COMMUTE | "Auto ki price?" / "Cab kitni lagegi?" |
| WEATHER | "Mausam kaisa hai?" / "Baarish hogi?" |
| EXPENSE_LOG | "₹200 auto mein diye" |
| SCHEDULE | "Kal ki schedule?" / "Aaj kya hai?" |
| BUDGET_CHECK | "Budget kitna bacha?" |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MINIMAX_API_KEY` | MiniMax m2.5 API key |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `GOOGLE_PLACES_API_KEY` | Google Places API key |
| `GOOGLE_DISTANCE_API_KEY` | Google Distance Matrix API key |
| `OPENWEATHERMAP_API_KEY` | OpenWeatherMap API key |
| `MONGO_URI` | MongoDB connection string |

## Architecture

```
User (WhatsApp)
     ↓
Twilio → Webhook Controller
     ↓
Intent Classification (AI)
     ↓
Route Handler (Food/Commute/Weather/etc.)
     ↓
External APIs (Google Places/Distance/Weather)
     ↓
AI Response Generation
     ↓
Twilio (Send Reply)
```

## Testing

Test the webhook locally:
```bash
curl -X POST http://localhost:5001/api/v1/webhook/twilio \
  -H "Content-Type: application/json" \
  -d '{"From":"whatsapp:+919999999999","Body":"Weather kaisa hai?","SmsMessageSid":"test123"}'
```

## Running

```bash
npm start        # Production
npm run dev      # Development with nodemon
```