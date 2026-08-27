import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { MOCK_HOTELS, MOCK_ACTIVITIES, generateAIInsights, fetchListings, mapDbToHotel, mapDbToActivity } from "../lib/api";
import { ArrowLeft, Star, Clock, Users, ExternalLink, CreditCard, Sparkles, X, CheckCircle, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import DemandEngine from "../components/DemandEngine";

export default function ItineraryPage() {
  const navigate = useNavigate();
  const { destination: destId } = useParams();
  const { destination, members, budget, addToCart, removeFromCart, cart, selectedHotel, selectHotel, getRemainingBudget } = useTripStore();
  const nights = 2;

  const [activeCategory, setActiveCategory] = useState(null); // 'hotel', 'hostel', 'home'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState("All");
  const [aiInsights, setAiInsights] = useState({});
  const [dbStays, setDbStays] = useState([]);
  const [dbActivities, setDbActivities] = useState([]);

  useEffect(() => {
    if (!destination?.name) return;

    fetchListings().then(listings => {
      const targetDest = destination.name.toLowerCase().trim();
      const locationFiltered = listings.filter(l => 
        l.location && l.location.toLowerCase().includes(targetDest)
      );

      const stays = locationFiltered.filter(l => l.category === "Stay").map(mapDbToHotel);
      const acts = locationFiltered.filter(l => l.category === "Activities").map(mapDbToActivity);
      setDbStays(stays);
      setDbActivities(acts);
    }).catch(err => console.error("Itinerary fetch error:", err));
  }, [destination]);

  const allHotels = [...MOCK_HOTELS, ...dbStays];
  const allActivities = [...MOCK_ACTIVITIES, ...dbActivities];

  const inCart = (id) => cart.some((i) => i.id === id);

  const handleAddActivity = (item) => {
    if (inCart(item.id)) {
      removeFromCart(item.id);
      toast.success(`${item.name} removed`);
    } else {
      addToCart({ ...item, type: "activity", price: item.price * members });
      toast.success(`${item.name} added`);
    }
  };

  const openStayModal = (category) => {
    setActiveCategory(category);
    setIsModalOpen(true);
  };

  // Pre-fetch AI insights for hotels when modal opens
  useEffect(() => {
    if (isModalOpen && activeCategory) {
      const hotels = allHotels.filter(h => h.type === activeCategory);
      hotels.forEach(hotel => {
        if (!aiInsights[hotel.id]) {
          generateAIInsights(hotel.name, hotel.type, { destination: destination?.name, budget, members }).then(insight => {
            setAiInsights(prev => ({ ...prev, [hotel.id]: insight }));
          });
        }
      });
    }
  }, [isModalOpen, activeCategory, aiInsights, destination, budget, members]);

  const filteredActivities = activityFilter === "All" 
    ? allActivities 
    : allActivities.filter(a => a.category === activityFilter);

  const categories = ["All", ...Array.from(new Set(allActivities.map(a => a.category)))];

  const totalCost = cart.reduce((sum, i) => sum + i.price, 0) + (selectedHotel ? selectedHotel.price * nights : 0);
  const remaining = getRemainingBudget();

  return (
    <div className="min-h-screen relative font-body text-slate-100">
      {/* Full Page Fixed Background */}
      <div className="fixed inset-0 z-[-1]">
        <img 
          src={destination?.image || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200"} 
          alt="Destination Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
      </div>

      {/* Header & Budget Tracker */}
      <div className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/plan")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-semibold text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        
        {/* Interactive Budget Tracker */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 pr-4 border-r border-white/10">
            <div className="bg-orange-500/20 p-2 rounded-lg"><Wallet size={20} className="text-orange-400" /></div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Total Budget</p>
              <p className="font-bold text-sm">₹{(budget * members).toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="px-2">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Remaining</p>
            <p className={`font-bold text-lg ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              ₹{remaining.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Destination Name Overlay */}
        <div className="mb-16 text-center">
          <p className="text-orange-400 font-bold tracking-[0.3em] uppercase text-sm mb-4">Curated For You</p>
          <h1 className="font-display font-bold text-6xl md:text-8xl text-white tracking-tight drop-shadow-2xl">
            {destination?.name || "Destination"}
          </h1>
        </div>

        {/* Stay Selection Section */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-orange-500"></span> Select Your Stay
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => openStayModal("hotel")} className="group cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-orange-500/50 transition-all text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-bold mb-2 relative z-10">Hotels & Villas</h3>
              <p className="text-sm text-white/60 relative z-10">Premium luxury & comfort</p>
            </div>
            <div onClick={() => openStayModal("hostel")} className="group cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-orange-500/50 transition-all text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-bold mb-2 relative z-10">Hostels & Dorms</h3>
              <p className="text-sm text-white/60 relative z-10">Social, vibrant & budget-friendly</p>
            </div>
            <div onClick={() => openStayModal("home")} className="group cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 hover:border-orange-500/50 transition-all text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-bold mb-2 relative z-10">Local Homes</h3>
              <p className="text-sm text-white/60 relative z-10">Authentic local experiences</p>
            </div>
          </div>

          {selectedHotel && (
            <div className="mt-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-4">
                <img src={selectedHotel.image} alt={selectedHotel.name} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <p className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">Selected Stay</p>
                  <h4 className="font-bold text-xl">{selectedHotel.name}</h4>
                  <p className="text-white/60 text-sm">₹{(selectedHotel.price * nights).toLocaleString("en-IN")} total for {nights} nights</p>
                </div>
              </div>
              <button onClick={() => openStayModal(selectedHotel.type)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">
                Change Stay
              </button>
            </div>
          )}
        </div>

        {/* Demand Engine Section */}
        <DemandEngine destination={destination} budget={budget} />

        {/* Activities Section */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-orange-500"></span> Curated Activities
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActivityFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activityFilter === cat ? "bg-orange-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => (
              <div key={act.id} className="bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-3xl p-6 hover:border-white/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold tracking-wider text-orange-400 uppercase bg-orange-400/10 px-3 py-1 rounded-full">{act.category}</span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                      <Star size={14} className="fill-yellow-400" /> {act.rating}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{act.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/50 mb-6">
                    <div className="flex items-center gap-1"><Clock size={14}/> {act.duration}</div>
                    <div className="flex items-center gap-1"><Users size={14}/> {act.slots} slots</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <div>
                    <span className="text-xl font-bold">₹{act.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-white/50"> /pp</span>
                  </div>
                  <button
                    onClick={() => handleAddActivity(act)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                      inCart(act.id) ? "bg-emerald-500 text-white" : "bg-white text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    {inCart(act.id) ? "Added ✓" : "Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Total & Booking Actions */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10">
            <p className="text-sm font-bold text-orange-400 tracking-widest uppercase mb-2">Final Summary</p>
            <p className="font-display text-4xl md:text-5xl font-bold">₹{totalCost.toLocaleString("en-IN")}</p>
            <p className="text-white/50 mt-2">Includes {nights} nights stay + {cart.length} activities</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
            {cart.length > 0 && (
              <button onClick={() => navigate("/booking")} className="flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                <CreditCard size={20} /> Book Activities
              </button>
            )}
            
            {selectedHotel && (
              <button onClick={() => window.open(`https://www.booking.com/searchresults.html?ss=${destination?.name}`, "_blank")} className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all">
                <ExternalLink size={20} /> Book Hotel Room
              </button>
            )}
            
            {!selectedHotel && cart.length === 0 && (
              <div className="text-white/50 italic px-8 py-4">Add a stay or activity to proceed</div>
            )}
          </div>
        </div>
      </div>

      {/* Stay Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-on-load">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-2xl font-bold capitalize">Suggested {activeCategory}s</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white bg-white/5 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6 flex-1 custom-scrollbar">
              {allHotels.filter(h => h.type === activeCategory).map(hotel => (
                <div key={hotel.id} className={`flex flex-col md:flex-row gap-6 p-4 rounded-2xl border transition-all ${selectedHotel?.id === hotel.id ? 'bg-orange-500/10 border-orange-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <img src={hotel.image} alt={hotel.name} className="w-full md:w-48 h-48 rounded-xl object-cover" />
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-xl font-bold">{hotel.name}</h4>
                        {hotel.id.length > 20 && ( // MongoDB IDs are long, mock IDs are short
                          <span className="w-max text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified Local Gem</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {Array.from({length: hotel.stars}).map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.map(a => <span key={a} className="text-[10px] px-2 py-1 border border-white/10 rounded text-white/60">{a}</span>)}
                    </div>
                    
                    {aiInsights[hotel.id] && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4 text-sm text-blue-200 flex gap-3 items-start">
                        <Sparkles size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="italic">{aiInsights[hotel.id]}</p>
                      </div>
                    )}
                    
                    <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                      <div>
                        <span className="text-2xl font-bold text-orange-400">₹{hotel.price.toLocaleString("en-IN")}</span>
                        <span className="text-xs text-white/50"> /night</span>
                      </div>
                      <button
                        onClick={() => {
                          selectHotel(hotel);
                          toast.success(`${hotel.name} selected as your stay.`);
                          setIsModalOpen(false);
                        }}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                          selectedHotel?.id === hotel.id ? "bg-orange-500 text-white" : "bg-white text-slate-900 hover:bg-slate-200"
                        }`}
                      >
                        {selectedHotel?.id === hotel.id ? <><CheckCircle size={16} /> Selected</> : "Select Stay"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {allHotels.filter(h => h.type === activeCategory).length === 0 && (
                <div className="text-center py-12 text-white/50">
                  No {activeCategory}s currently available in this area.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
