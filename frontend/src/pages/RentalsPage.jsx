import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { fetchListings, mapDbToRental } from "../lib/api";
import { ArrowLeft, Car, Bike, ShieldCheck, Zap, Info, Clock, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

// Move MOCK_RENTALS outside the component
export const MOCK_RENTALS = [
  // CARS
  {
    id: 1,
    category: "cars",
    name: "Mahindra Thar",
    image: "https://images.unsplash.com/photo-1710225358761-4f5891df657d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 499,
    rushHourPrice: 699,
    budgetTier: "PREMIUM TIER",
    features: ["4x4", "SUV", "Adventure"],
  },
  {
    id: 2,
    category: "cars",
    name: "BMW X5",
    image: "https://images.unsplash.com/photo-1617531653635-4b0e357c091b?q=80&w=777&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 1299,
    rushHourPrice: 1699,
    budgetTier: "LUXURY TIER",
    features: ["Luxury", "Automatic", "Premium"],
  },
  {
    id: 3,
    category: "cars",
    name: "Hyundai Creta",
    image: "https://images.unsplash.com/photo-1633359064754-804ba55e733f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aHl1bmRhaSUyMGNyZXRhfGVufDB8fDB8fHww",
    pricePerHour: 349,
    rushHourPrice: 499,
    budgetTier: "ECONOMY TIER",
    features: ["SUV", "Family", "Comfort"],
  },
  {
    id: 4,
    category: "cars",
    name: "Toyota Fortuner",
    image: "https://images.unsplash.com/photo-1670054953044-2605dbd0d747?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 899,
    rushHourPrice: 1199,
    budgetTier: "PREMIUM TIER",
    features: ["Offroad", "SUV", "Roadtrip"],
  },
  {
    id: 5,
    category: "cars",
    name: "Mercedes C-Class",
    image: "https://images.unsplash.com/photo-1610099610040-ab19f3a5ec35?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 1599,
    rushHourPrice: 1999,
    budgetTier: "LUXURY TIER",
    features: ["Luxury", "Sedan", "Automatic"],
  },
  {
    id: 6,
    category: "cars",
    name: "Maruti Swift",
    image: "https://images.unsplash.com/photo-1663852408695-f57f4d75a536?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 199,
    rushHourPrice: 299,
    budgetTier: "ECONOMY TIER",
    features: ["Budget", "Fuel Efficient", "City"],
  },
  {
    id: 7,
    category: "cars",
    name: "Range Rover Velar",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 1999,
    rushHourPrice: 2599,
    budgetTier: "LUXURY TIER",
    features: ["Luxury", "SUV", "Premium"],
  },
  {
    id: 8,
    category: "cars",
    name: "Kia Seltos",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 399,
    rushHourPrice: 599,
    budgetTier: "PREMIUM TIER",
    features: ["SUV", "Family", "Travel"],
  },
  {
    id: 9,
    category: "cars",
    name: "Audi Q7",
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pricePerHour: 1899,
    rushHourPrice: 2399,
    budgetTier: "LUXURY TIER",
    features: ["Luxury", "Premium", "Roadtrip"],
  },
  {
    id: 10,
    category: "cars",
    name: "Honda City",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 299,
    rushHourPrice: 449,
    budgetTier: "ECONOMY TIER",
    features: ["Sedan", "Comfort", "City"],
  },
  // BIKES
  {
    id: 11,
    category: "bikes",
    name: "Royal Enfield Classic 350",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 199,
    rushHourPrice: 299,
    budgetTier: "PREMIUM TIER",
    features: ["Cruiser", "Touring", "Classic"],
  },
  {
    id: 12,
    category: "bikes",
    name: "KTM Duke 390",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 249,
    rushHourPrice: 349,
    budgetTier: "PREMIUM TIER",
    features: ["Sports", "Fast", "Adventure"],
  },
  {
    id: 13,
    category: "bikes",
    name: "Yamaha R15",
    image: "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 179,
    rushHourPrice: 249,
    budgetTier: "ECONOMY TIER",
    features: ["Sports", "Mileage", "Stylish"],
  },
  {
    id: 14,
    category: "bikes",
    name: "BMW GS 1250",
    image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 699,
    rushHourPrice: 899,
    budgetTier: "LUXURY TIER",
    features: ["Adventure", "Touring", "Premium"],
  },
  {
    id: 15,
    category: "bikes",
    name: "Royal Enfield Himalayan",
    image: "https://images.unsplash.com/photo-1529429617124-aee711a5ac1c?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 229,
    rushHourPrice: 329,
    budgetTier: "PREMIUM TIER",
    features: ["Adventure", "Mountain", "Touring"],
  },
  // SCOOTY
  {
    id: 21,
    category: "scooty",
    name: "Honda Activa 6G",
    image: "https://images.unsplash.com/photo-1594142429108-596289ff97ea?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 99,
    rushHourPrice: 149,
    budgetTier: "ECONOMY TIER",
    features: ["Automatic", "City Ride", "Mileage"],
  },
  {
    id: 22,
    category: "scooty",
    name: "TVS Ntorq",
    image: "https://images.unsplash.com/photo-1611242320536-f12d3541249b?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 129,
    rushHourPrice: 179,
    budgetTier: "PREMIUM TIER",
    features: ["Sporty", "Bluetooth", "Fast"],
  },
  {
    id: 23,
    category: "scooty",
    name: "Suzuki Access",
    image: "https://images.unsplash.com/photo-1568772585407-9363f9bf3a87?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 109,
    rushHourPrice: 159,
    budgetTier: "ECONOMY TIER",
    features: ["Comfort", "Mileage", "Automatic"],
  },
  {
    id: 24,
    category: "scooty",
    name: "Ather 450X",
    image: "https://images.unsplash.com/photo-1620610531393-271505c87332?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 199,
    rushHourPrice: 279,
    budgetTier: "PREMIUM TIER",
    features: ["Electric", "Smart", "Premium"],
  },
  // CYCLES
  {
    id: 31,
    category: "cycles",
    name: "Mountain Explorer",
    image: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 49,
    rushHourPrice: 79,
    budgetTier: "ECONOMY TIER",
    features: ["Mountain", "Adventure", "Lightweight"],
  },
  {
    id: 32,
    category: "cycles",
    name: "Urban Rider",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 39,
    rushHourPrice: 59,
    budgetTier: "ECONOMY TIER",
    features: ["City", "Comfort", "Daily"],
  },
  {
    id: 33,
    category: "cycles",
    name: "Roadster Pro",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 69,
    rushHourPrice: 99,
    budgetTier: "PREMIUM TIER",
    features: ["Roadbike", "Fast", "Fitness"],
  },
  {
    id: 34,
    category: "cycles",
    name: "Electric Cycle X",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=2000&auto=format&fit=crop",
    pricePerHour: 129,
    rushHourPrice: 179,
    budgetTier: "PREMIUM TIER",
    features: ["Electric", "Modern", "Smart"],
  },
];

export default function RentalsPage() {
  const navigate = useNavigate();
  const { budget, members, budgetType, destination } = useTripStore();
  const [activeCategory, setActiveCategory] = useState("cars");
  const [scrolled, setScrolled] = useState(false);
  const [dbRentals, setDbRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "cars", name: "Cars", icon: <Car size={20} /> },
    { id: "bikes", name: "Bikes", icon: <Bike size={20} /> },
    { id: "scooty", name: "Scooty", icon: <Zap size={20} /> },
    { id: "cycles", name: "Cycles", icon: <Info size={20} /> },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    // Fetch DB Listings
    if (!destination?.name) {
      setLoading(false);
    } else {
      fetchListings().then(listings => {
        const targetDest = destination.name.toLowerCase().trim();
        const rentals = listings
          .filter(l => 
            l.category === "Transport" && 
            l.location && l.location.toLowerCase().includes(targetDest)
          )
          .map(mapDbToRental);
        setDbRentals(rentals);
        setLoading(false);
      }).catch(err => {
        console.error("Rentals fetch error:", err);
        setLoading(false);
      });
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [destination]);

  const perPersonBudget = budgetType === "per_person" ? budget : Math.round(budget / members);
  
  const getTier = (perPerson) => {
    if (perPerson < 8000) return "ECONOMY TIER";
    if (perPerson < 25000) return "PREMIUM TIER";
    return "LUXURY TIER";
  };

  const userTier = getTier(perPersonBudget);

  const allRentals = [...MOCK_RENTALS, ...dbRentals];
  const filteredRentals = allRentals.filter(r => r.category === activeCategory);
  
  // Recommend vehicles based on user budget tier
  const recommendedVehicles = filteredRentals.filter(r => r.budgetTier === userTier);
  const otherVehicles = filteredRentals.filter(r => r.budgetTier !== userTier);

  return (
    <div className="min-h-screen bg-[#050816] text-white font-body">
      <Navbar scrolled={scrolled} />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to planning
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-orange-400 font-bold tracking-[0.3em] uppercase text-xs mb-3">Rental Marketplace</p>
              <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tighter">
                Premium <span className="text-orange-500">Wheels.</span>
              </h1>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Your Budget Tier</p>
              <p className="text-xl font-bold text-orange-400">{userTier}</p>
              <p className="text-[10px] text-white/60 mt-1">Based on ₹{perPersonBudget.toLocaleString()} per person budget</p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 border
                ${activeCategory === cat.id 
                  ? "bg-orange-500 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)] text-white scale-105" 
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"}
              `}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {filteredRentals.length > 0 ? (
          <>
            {/* Recommended Section */}
            {recommendedVehicles.length > 0 && (
              <div className="mb-20">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-orange-500"></span> Recommended for your budget
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recommendedVehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} recommended />
                  ))}
                </div>
              </div>
            )}

            {/* All/Other Vehicles */}
            <div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-white/20"></span> {recommendedVehicles.length > 0 ? "Other Options" : `Available ${activeCategory}`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="py-20 text-center bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
            <AlertCircle size={48} className="mx-auto text-orange-500 mb-6 opacity-50" />
            <h3 className="text-2xl font-black text-white mb-2">No {activeCategory}s Found</h3>
            <p className="text-white/40 max-w-sm mx-auto px-6">We currently don't have any {activeCategory} listings for {destination?.name || 'this location'}. Try switching categories or destinations!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, recommended }) {
  return (
    <div className={`
      group relative bg-white/5 border rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white/10
      ${recommended ? 'border-orange-500/30' : 'border-white/10 hover:border-white/20'}
    `}>
      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
          Best Value
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">{vehicle.name}</h3>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{vehicle.budgetTier}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-400">₹{vehicle.pricePerHour}</p>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">per hour</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-8">
          {vehicle.features.map(f => (
            <span key={f} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/60 font-medium">
              {f}
            </span>
          ))}
        </div>

        {/* Dynamic Pricing Box */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-orange-400">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Dynamic Pricing</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white/40">
              <AlertCircle size={12} />
              <span>Rush hour info</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Rush Hour Price</p>
              <p className="text-lg font-bold text-rose-400">₹{vehicle.rushHourPrice}<span className="text-xs text-white/40 font-normal"> /hr</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Increase</p>
              <p className="text-lg font-bold text-white">+{Math.round(((vehicle.rushHourPrice - vehicle.pricePerHour)/vehicle.pricePerHour)*100)}%</p>
            </div>
          </div>
        </div>

        <button className="w-full py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs transition-all hover:bg-orange-500 hover:text-white group">
          Book Now
          <ShieldCheck size={16} className="inline ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </button>
      </div>
    </div>
  );
}
