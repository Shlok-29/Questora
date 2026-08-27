import axios from "axios";
import { API_BASE_URL } from "../config";

export const fetchWeather = async (city) => {
  try {
    // Using a reliable weather API (mocked for the demo but structured for real API)
    return {
      temp: 22,
      condition: "Clear",
      icon: "☀️"
    };
  } catch (err) {
    console.error("Failed to fetch weather:", err);
    return null;
  }
};

export const fetchListings = async () => {
  try {
    const apiUrl = API_BASE_URL;
    const res = await axios.get(`${apiUrl}/listings`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch listings:", err);
    return [];
  }
};

export const mapDbToRental = (listing) => ({
  id: listing._id,
  name: listing.title,
  category: listing.subCategory || 'cars',
  pricePerHour: listing.price,
  rushHourPrice: Math.round(listing.price * 1.2),
  image: listing.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600',
  features: listing.facilities || [],
  budgetTier: listing.price < 800 ? "ECONOMY TIER" : (listing.price < 2500 ? "PREMIUM TIER" : "LUXURY TIER")
});

export const mapDbToHotel = (listing) => ({
  id: listing._id,
  name: listing.title,
  type: listing.subCategory || 'hotel',
  stars: 4,
  price: listing.price,
  currency: 'INR',
  amenities: listing.facilities || [],
  image: listing.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600'
});

export const mapDbToActivity = (listing) => ({
  id: listing._id,
  name: listing.title,
  duration: '2 hrs',
  price: listing.price,
  category: listing.subCategory || 'Adventure',
  rating: 4.5,
  slots: listing.maxGuests || 10,
  shortDesc: listing.description,
  thumb1: listing.images?.[0] || 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=300',
  thumb2: listing.images?.[1] || listing.images?.[0] || 'https://images.unsplash.com/photo-1544627255-75e11a2f1ab6?w=300'
});

// ─── Gemini: AI Itinerary Generator ───────────────────────────────────────────
const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";

export const generateItinerary = async (destination, members, budget, activities) => {
  try {
    const prompt = `As a luxury travel planner, create a detailed 3-day weekend itinerary for ${destination}. 
Group size: ${members} people. Budget: ₹${budget}. 
Must-do: ${activities.join(", ")}.
Return JSON with: { overview, days: [{date, morning, afternoon, evening, hotel, estimatedCost}] }
Keep it luxury, concise, executive-level.`;

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    const text = res.data.candidates[0].content.parts[0].text;
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
};

// ─── OpenAI: AI Insights ───────────────────────────────────────────────────────
const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY || "";

export const generateAIInsights = async (itemName, type, userProfile) => {
  try {
    const prompt = `As a luxury travel advisor, write a 2-sentence highly personalized pitch on why the ${type} "${itemName}" is a perfect fit for a group of ${userProfile.members} travelers visiting ${userProfile.destination} with a budget of ₹${userProfile.budget}. Make it sound exclusive and enticing.`;
    
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error:", error);
    return `An excellent choice for your stay in ${userProfile.destination}, offering great amenities and comfort tailored to your group.`;
  }
};

// ─── Mock fallbacks (so UI never breaks without API keys) ────────────────────
export const MOCK_HOTELS = [
  // Hotels and Villas
  { id: "h1", name: "Aloha on the Ganges", type: "hotel", stars: 5, price: 8500, currency: "INR", amenities: ["Pool", "Spa", "Yoga", "River View"], image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600" },
  { id: "h2", name: "The Glasshouse on the Ganges", type: "hotel", stars: 5, price: 12000, currency: "INR", amenities: ["Heritage", "Private Beach", "Butler", "Gourmet"], image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600" },
  { id: "v1", name: "Himalayan Sunrise Villa", type: "hotel", stars: 4, price: 15000, currency: "INR", amenities: ["Private Chef", "4 Bedrooms", "Mountain View", "Fireplace"], image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600" },
  
  // Hostels and Dormitory
  { id: "ho1", name: "Zostel Rishikesh", type: "hostel", stars: 4, price: 800, currency: "INR", amenities: ["Bunk Beds", "Cafe", "WiFi", "Social Events"], image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600" },
  { id: "ho2", name: "The Hosteller", type: "hostel", stars: 4, price: 900, currency: "INR", amenities: ["AC Dorms", "Library", "Terrace", "Lockers"], image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600" },

  // Local Staying Homes
  { id: "lh1", name: "Sharma Family Homestay", type: "home", stars: 5, price: 2500, currency: "INR", amenities: ["Home Cooked Meals", "Local Guide", "Garden", "Authentic"], image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600" },
  { id: "lh2", name: "Riverside Cottage", type: "home", stars: 4, price: 3200, currency: "INR", amenities: ["Private Access", "Pet Friendly", "Kitchen", "Quiet"], image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600" }
];

export const MOCK_ACTIVITIES = [
  { id: "a1", name: "White Water Rafting — Grade 4", duration: "3 hrs", price: 1200, category: "Extreme", rating: 4.8, slots: 20, image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800", shortDesc: "Navigate the thrilling rapids of the Ganges with expert guides. Experience the ultimate adrenaline rush amidst the breathtaking Himalayan foothills." },
  { id: "a2", name: "Bungee Jumping at Mohan Chatti", duration: "2 hrs", price: 3500, category: "Extreme", rating: 4.9, slots: 8, image: "https://images.unsplash.com/photo-1522044810620-3e28ce194ddc?w=800", shortDesc: "Take a leap of faith from India's highest bungee platform. Feel the wind rush past as you free-fall over the pristine valley." },
  { id: "a3", name: "Sunset Kayaking on Ganges", duration: "1.5 hrs", price: 900, category: "Adventure", rating: 4.7, slots: 15, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", shortDesc: "Paddle along the serene waters of the Ganges as the sun dips below the horizon. Enjoy an intimate, peaceful encounter with the river's evening calm." },
  { id: "a4", name: "Beatles Ashram Yoga Retreat", duration: "Half day", price: 1500, category: "Wellness", rating: 4.6, slots: 30, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800", shortDesc: "Immerse yourself in deep meditation at the historic Chaurasi Kutia ashram. Connect with your inner self in the very place that inspired the legendary band." },
  { id: "a5", name: "Camping & Bonfire at Shivpuri", duration: "Overnight", price: 2800, category: "Adventure", rating: 4.8, slots: 25, image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800", shortDesc: "Spend an unforgettable night under the starry sky on the white sand beaches of the Ganges. Share stories around a crackling bonfire with fellow travelers." },
  { id: "a6", name: "Ganga Aarti & Local Walk", duration: "2 hrs", price: 500, category: "Culture", rating: 4.9, slots: 50, image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Aarti_raised_up_during_evening_Ganga_aarti%2C_Varanasi.jpg", shortDesc: "Witness the mesmerizing evening fire ritual performed by synchronized priests on the ghats. Followed by a guided walk through the ancient, vibrant alleys." },
  { id: "a7", name: "Himalayan Mountain Biking", duration: "4 hrs", price: 1800, category: "Extreme", rating: 4.7, slots: 10, image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800", shortDesc: "Conquer rugged mountain trails with spectacular panoramic views of the Garhwal Himalayas. A challenging and rewarding adventure for cycling enthusiasts." },
  { id: "a8", name: "Pottery Class with Locals", duration: "2 hrs", price: 600, category: "Culture", rating: 4.5, slots: 12, image: "https://images.unsplash.com/photo-1533907650686-70576141c030?w=800", shortDesc: "Learn the traditional art of clay pottery directly from local artisans. Shape your own souvenirs on a classic spinning wheel while hearing village stories." }
];

export const MOCK_RENTALS = [
  { id: "r1", name: "Hyundai Creta", category: "cars", pricePerHour: 500, rushHourPrice: 750, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600", features: ["AC", "Automatic", "5 Seats"], budgetTier: "PREMIUM TIER" },
  { id: "r2", name: "Maruti Swift", category: "cars", pricePerHour: 300, rushHourPrice: 450, image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600", features: ["AC", "Manual", "5 Seats"], budgetTier: "ECONOMY TIER" },
  { id: "r3", name: "Mercedes C-Class", category: "cars", pricePerHour: 1500, rushHourPrice: 2200, image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600", features: ["Luxury", "Sunroof", "5 Seats"], budgetTier: "LUXURY TIER" },
  { id: "r4", name: "Royal Enfield Classic 350", category: "bikes", pricePerHour: 150, rushHourPrice: 250, image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=600", features: ["Cruiser", "Retro", "2 Seats"], budgetTier: "ECONOMY TIER" },
  { id: "r5", name: "KTM Duke 390", category: "bikes", pricePerHour: 200, rushHourPrice: 300, image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600", features: ["Sport", "Fast", "2 Seats"], budgetTier: "PREMIUM TIER" },
  { id: "r6", name: "Activa 6G", category: "scooty", pricePerHour: 80, rushHourPrice: 130, image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600", features: ["Easy to ride", "Storage", "2 Seats"], budgetTier: "ECONOMY TIER" },
  { id: "r7", name: "Vespa Elegante", category: "scooty", pricePerHour: 120, rushHourPrice: 180, image: "https://images.unsplash.com/photo-1597813583279-2479f649887f?w=600", features: ["Stylish", "Smooth", "2 Seats"], budgetTier: "PREMIUM TIER" },
  { id: "r8", name: "Mountain MTB Cycle", category: "cycles", pricePerHour: 30, rushHourPrice: 50, image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600", features: ["Off-road", "Geared", "1 Seat"], budgetTier: "ECONOMY TIER" }
];

export const DESTINATIONS = [
  { id: "manali", name: "Manali", tagline: "Adventure & Peace", state: "Himachal Pradesh", tag: "Mountain", color: "#3b82f6", crowdLevel: "high", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800" },
  { id: "goa", name: "Goa", tagline: "Beaches & Vibes", state: "Goa", tag: "Coastal", color: "#f97316", crowdLevel: "medium", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800" },
  { id: "rishikesh", name: "Rishikesh", tagline: "Yoga & Rafting", state: "Uttarakhand", tag: "Spiritual", color: "#22c55e", crowdLevel: "low", image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800" },
  { id: "shimla", name: "Shimla", tagline: "Hills & Heritage", state: "Himachal Pradesh", tag: "Scenic", color: "#3b82f6", crowdLevel: "high", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800" },
  { id: "varanasi", name: "Varanasi", tagline: "Culture & Ghats", state: "Uttar Pradesh", tag: "Heritage", color: "#f97316", crowdLevel: "medium", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800" },
  { id: "coorg", name: "Coorg", tagline: "Mist & Coffee", state: "Karnataka", tag: "Nature", color: "#22c55e", crowdLevel: "low", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800" },
];
