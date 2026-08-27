import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import { DESTINATIONS, MOCK_ACTIVITIES, fetchWeather } from "../lib/api";
import { ArrowLeft, ChevronDown, ChevronUp, Plus, Minus, Check, CheckCircle2, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { format, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, isBefore, startOfDay, addDays, addMonths, subMonths } from "date-fns";

function CustomCalendar({ dateRange, setDateRange, weather, destinationId }) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const [availabilityData, setAvailabilityData] = useState({});

  useEffect(() => {
    if (!destinationId) return;
    const fetchAvailability = async () => {
      try {
        const startStr = startDate.toISOString();
        const endStr = endDate.toISOString();
        const res = await fetch(`http://localhost:5000/api/availability?destinationId=${destinationId}&start=${startStr}&end=${endStr}`);
        const data = await res.json();
        if (data.dailyTotals) {
          setAvailabilityData(data.dailyTotals);
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      }
    };
    fetchAvailability();
  }, [destinationId, currentMonth]);

  const onDateClick = (day) => {
    if (isBefore(day, startOfDay(new Date()))) return;
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: day, end: null });
    } else if (isBefore(day, dateRange.start)) {
      setDateRange({ start: day, end: null });
    } else {
      setDateRange({ start: dateRange.start, end: day });
    }
  };

  const getWeatherForDay = (day) => {
    if (!weather) return null;
    if (isBefore(day, startOfDay(new Date()))) return null;
    const seed = day.getDate();
    const tempVar = (seed % 5) - 2;
    const icons = ['☀️', '🌤️', '⛅', '☁️', '🌦️'];
    const icon = icons[seed % icons.length];
    const temp = weather.temp + tempVar;
    
    let statusText = "Moderate";
    if (temp > 30) statusText = "Hot";
    if (temp < 15) statusText = "Cold";
    
    return { temp, icon, statusText };
  };

  const getAvailabilityForDay = (day) => {
    if (isBefore(day, startOfDay(new Date()))) return null;
    
    // Assume daily capacity of 50 for the hackathon simulation
    const MAX_CAPACITY = 50;
    const dateStr = day.toISOString().split('T')[0];
    const booked = availabilityData ? (availabilityData[dateStr] || 0) : 0;
    
    let score = (booked / MAX_CAPACITY) * 100;
    // Just to have some visual variance if 0 bookings, add a tiny bit of random baseline based on weekend
    if (booked === 0) {
       const isWeekend = day.getDay() === 0 || day.getDay() === 6;
       score = isWeekend ? 30 : 10;
    }
    
    if (score >= 80) return { status: 'red', text: 'Low Availability', colorClass: 'bg-red-500' };
    if (score >= 50) return { status: 'yellow', text: 'Filling Fast', colorClass: 'bg-yellow-500' };
    return { status: 'green', text: 'Available', colorClass: 'bg-emerald-500' };
  };

  return (
    <div className="bg-white/90 border border-slate-200 rounded-2xl p-4 shadow-sm backdrop-blur-md">
      <div className="flex justify-between items-center mb-3 px-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-full transition-colors shadow-sm"><ArrowLeft size={12}/></button>
        <span className="font-display font-bold text-lg text-slate-900 tracking-wide uppercase">{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-full transition-colors shadow-sm"><ArrowLeft size={12} className="rotate-180"/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1 uppercase tracking-widest">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isSelectedStart = dateRange.start && isSameDay(day, dateRange.start);
          const isSelectedEnd = dateRange.end && isSameDay(day, dateRange.end);
          const isWithin = dateRange.start && dateRange.end && isWithinInterval(day, { start: dateRange.start, end: dateRange.end });
          const isSelected = isSelectedStart || isSelectedEnd || isWithin;
          const isPast = isBefore(day, startOfDay(new Date()));
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          const dayWeather = isCurrentMonth && !isPast ? getWeatherForDay(day) : null;
          const availability = isCurrentMonth && !isPast ? getAvailabilityForDay(day) : null;

          return (
            <div 
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={`
                min-h-[60px] p-1 border rounded-lg flex flex-col items-center justify-start cursor-pointer transition-all relative overflow-hidden
                ${!isCurrentMonth ? 'opacity-20 pointer-events-none border-transparent' : 'border-slate-100'}
                ${isPast ? 'opacity-40 pointer-events-none bg-slate-50 border-slate-200' : 'hover:border-orange-400 hover:shadow-sm'}
                ${isSelected ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-[1.02] z-10' : 'bg-white text-slate-700'}
                ${isWithin && !isSelectedStart && !isSelectedEnd ? 'bg-orange-50 text-orange-900 border-orange-200 shadow-none transform-none' : ''}
              `}
            >
              {availability && !isSelected && (
                <div className={`absolute top-0 right-0 w-full h-1 ${availability.colorClass} opacity-80`}></div>
              )}
              
              <span className={`text-sm font-bold mt-1 ${isSelected && !isWithin ? 'text-white' : ''}`}>{format(day, "d")}</span>
              
              <div className="mt-auto w-full flex flex-col items-center gap-0.5 pb-0.5">
                {dayWeather && (
                  <span className={`text-[9px] font-bold leading-none ${isSelected && !isWithin ? 'text-orange-100' : 'text-slate-400'}`}>
                    {dayWeather.temp}° {dayWeather.statusText}
                  </span>
                )}
                {availability && (
                  <span className={`text-[8px] font-bold leading-none px-1 py-0.5 rounded-sm uppercase tracking-wider
                    ${isSelected && !isWithin ? 'bg-white/20 text-white' : 
                      availability.status === 'red' ? 'bg-red-100 text-red-600' : 
                      availability.status === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-emerald-100 text-emerald-600'}
                  `}>
                    {availability.text}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PlanPage() {
  const navigate = useNavigate();
  const {
    destination,
    setDestination,
    tripName,
    setTripName,
    members,
    setMembers,
    budgetType,
    setBudgetType,
    budget,
    setBudget,
    dateRange: storeDateRange,
    setDateRange,
    selectedActivities,
    toggleActivity,
    cart,
    addToCart
  } = useTripStore();

  const parseDateSafe = (d) => {
    if (!d) return null;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const dateRange = {
    start: parseDateSafe(storeDateRange?.start),
    end: parseDateSafe(storeDateRange?.end)
  };

  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState("ALL");
  const [weather, setWeather] = useState(null);
  const [selectedModalActivity, setSelectedModalActivity] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [activeMapActivity, setActiveMapActivity] = useState(null);

  // Node positions for the map
  const mapPositions = [
    { top: '25%', left: '20%' },
    { top: '40%', left: '55%' },
    { top: '75%', left: '30%' },
    { top: '20%', left: '75%' },
    { top: '65%', left: '70%' },
    { top: '55%', left: '15%' },
  ];

  useEffect(() => {
    if (!destination && DESTINATIONS.length > 0) {
      setDestination(DESTINATIONS[0]);
    } else if (destination) {
      fetchWeather(destination.name).then(setWeather);
    }
  }, [destination, setDestination]);

  // Derived Values
  const nights = dateRange.start && dateRange.end 
    ? Math.max(1, differenceInDays(dateRange.end, dateRange.start)) 
    : 0;

  const totalBudget = budgetType === "total" ? budget : budget * members;
  const perPersonBudget = budgetType === "per_person" ? budget : Math.round(budget / members);

  const getTier = (perPerson) => {
    if (perPerson < 8000) return "ECONOMY TIER";
    if (perPerson < 25000) return "PREMIUM TIER";
    return "LUXURY TIER";
  };

  const handleClearActivities = () => {
    selectedActivities.forEach(a => toggleActivity(a));
  };

  const handleBuildItinerary = () => {
    if (!dateRange.start || !dateRange.end) {
      toast.error("Please select travel dates.");
      return;
    }

    // Sync selectedActivities to cart
    selectedActivities.forEach(id => {
      const act = MOCK_ACTIVITIES.find(a => a.id === id);
      if (act && !cart.some(c => c.id === id)) {
        addToCart({ ...act, type: "activity", price: act.price * members });
      }
    });

    navigate(`/itinerary/${destination.id}`);
  };

  if (!destination) return null;

  return (
    <div className="min-h-screen font-body text-slate-900 pb-20 relative">
      <style>
        {`
          @keyframes cinematic-pan {
            0% { transform: scale(1) translate(0, 0); }
            100% { transform: scale(1.1) translate(-2%, -2%); }
          }
          .animate-cinematic {
            animation: cinematic-pan 40s ease-in-out infinite alternate;
          }
        `}
      </style>
      
      {/* Background Image Overlay - Lighter Blur */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-slate-100">
        <div 
          className="absolute inset-[-10%] bg-cover bg-center animate-cinematic"
          style={{ backgroundImage: `url(${destination.image})`, filter: 'brightness(1.1)' }}
        />
        <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[4px]" />
      </div>
      
      {/* Content wrapper with z-index */}
      <div className="relative z-10">
        
        {/* Navbar Minimal */}
        <div className="bg-slate-900/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white font-medium text-sm transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> BACK
          </button>
          <div className="font-display font-bold text-xl text-white">
            Quest<span className="text-orange-500">ora</span>
          </div>
          <div className="w-24"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* TOP 2-COLUMN SECTION (Config + Summary) */}
          <div className="flex flex-col lg:flex-row gap-12 mb-16">
            
            {/* LEFT COLUMN - CONFIG FORM */}
            <div className="flex-1 space-y-16">
              
              {/* Header */}
              <div>
                <p className="text-orange-600 font-bold text-xs tracking-[0.2em] mb-4 uppercase drop-shadow-sm">Configure your trip</p>
                <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-4 drop-shadow-sm">
                  Tell us what you <br/> <span className="text-orange-500 italic pr-2">want.</span>
                </h1>
                <p className="text-slate-800 text-lg font-medium drop-shadow-sm">We'll take care of every detail.</p>
              </div>

              {/* Trip Name */}
              <div>
                <p className="text-slate-700 font-bold text-xs tracking-wider mb-4 uppercase drop-shadow-sm">Trip Name (Optional)</p>
                <input 
                  type="text" 
                  value={tripName || ''}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g. Summer Escape"
                  className="w-full bg-white/70 backdrop-blur-md border-b-2 border-slate-300 py-4 px-2 text-xl font-medium text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all rounded-t-lg shadow-sm"
                />
              </div>

              {/* Select Destination */}
              <div>
                <p className="text-slate-700 font-bold text-xs tracking-wider mb-4 uppercase drop-shadow-sm">Select Destination</p>
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl overflow-hidden shadow-md">
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
                    onClick={() => setDestDropdownOpen(!destDropdownOpen)}
                  >
                    <div className="flex items-center gap-5">
                      <img src={destination.image} alt={destination.name} className="w-20 h-14 object-cover rounded-xl shadow-sm" />
                      <div>
                        <h3 className="font-display font-bold text-xl text-slate-900">{destination.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">{destination.tagline} • {destination.state}</p>
                      </div>
                    </div>
                    {destDropdownOpen ? <ChevronUp size={24} className="text-slate-400" /> : <ChevronDown size={24} className="text-slate-400" />}
                  </div>
                  
                  {destDropdownOpen && (
                    <div className="border-t border-slate-100 max-h-[400px] overflow-y-auto bg-white/95">
                      {DESTINATIONS.map((dest) => (
                        <div 
                          key={dest.id}
                          onClick={() => {
                            setDestination(dest);
                            setDestDropdownOpen(false);
                          }}
                          className={`p-5 flex items-center justify-between cursor-pointer hover:bg-orange-50 transition-colors border-b border-slate-100 last:border-0 ${destination.id === dest.id ? 'bg-orange-50/50' : ''}`}
                        >
                          <div className="flex items-center gap-5">
                            <img src={dest.image} alt={dest.name} className="w-16 h-12 object-cover rounded-lg shadow-sm" />
                            <div>
                              <h3 className="font-bold text-slate-900">{dest.name}</h3>
                              <p className="text-xs text-slate-500 font-medium">{dest.state}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-orange-600 px-4 py-1.5 bg-white rounded-full border border-orange-200 uppercase tracking-widest shadow-sm">
                            {dest.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Number of Members */}
              <div>
                <p className="text-slate-700 font-bold text-xs tracking-wider mb-6 uppercase drop-shadow-sm">Number of Members</p>
                <div className="flex flex-col md:flex-row md:items-center gap-10">
                  <div className="flex items-center gap-6 bg-white/60 backdrop-blur-md p-3 rounded-3xl border border-slate-200 shadow-sm">
                    <button 
                      onClick={() => setMembers(Math.max(1, members - 1))}
                      className="w-12 h-12 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-all shadow-sm"
                    >
                      <Minus size={20} />
                    </button>
                    <div className="text-center min-w-[90px]">
                      <span className="text-6xl font-display font-bold text-slate-900">{members}</span>
                      <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">Travelers</p>
                    </div>
                    <button 
                      onClick={() => setMembers(members + 1)}
                      className="w-12 h-12 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-all shadow-sm"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-600 mb-3 uppercase tracking-widest drop-shadow-sm">Quick Select</p>
                    <div className="flex flex-wrap gap-3">
                      {[5, 10, 15, 20, 25, 30].map(n => (
                        <button 
                          key={n}
                          onClick={() => setMembers(n)}
                          className={`w-14 h-12 rounded-xl text-sm font-bold transition-all shadow-sm ${members === n ? 'border-2 border-orange-500 bg-orange-500 text-white shadow-md transform scale-105' : 'border border-slate-200 bg-white/80 text-slate-600 hover:border-orange-300 hover:text-orange-600'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <p className="text-slate-700 font-bold text-xs tracking-wider mb-6 uppercase drop-shadow-sm">Budget Range</p>
                <div className="flex bg-slate-200/80 backdrop-blur-md rounded-xl p-1.5 w-max mb-8 shadow-inner">
                  <button 
                    onClick={() => { setBudgetType("per_person"); setBudget(perPersonBudget); }}
                    className={`px-8 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${budgetType === "per_person" ? "bg-white shadow-md text-orange-600" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Per Person
                  </button>
                  <button 
                    onClick={() => { setBudgetType("total"); setBudget(totalBudget); }}
                    className={`px-8 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${budgetType === "total" ? "bg-white shadow-md text-orange-600" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Total Budget
                  </button>
                </div>

                <div className="mb-10 bg-white/60 backdrop-blur-md border border-slate-200 p-8 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-4 mb-6 flex-wrap">
                    <span className="text-5xl md:text-6xl font-display font-bold text-slate-900">₹</span>
                    <input 
                      type="number" 
                      min="0"
                      value={budget}
                      onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-48 sm:w-64 bg-transparent text-5xl md:text-6xl font-display font-bold text-slate-900 outline-none border-b-4 border-slate-300 focus:border-orange-500 transition-colors"
                    />
                    <span className="text-sm font-bold text-slate-500 tracking-widest uppercase mt-4">/ {budgetType === "per_person" ? "Person" : "Total"}</span>
                  </div>
                  
                  <input 
                    type="range" 
                    min="0" 
                    max={budgetType === "per_person" ? 150000 : 150000 * members} 
                    step="1000"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500 mb-4 shadow-inner"
                  />

                  <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mt-2">{getTier(perPersonBudget)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <button 
                    onClick={() => setBudget(budgetType === "per_person" ? 5000 : 5000 * members)}
                    className={`border-2 p-5 rounded-2xl text-left transition-all ${getTier(perPersonBudget) === "ECONOMY TIER" ? "border-orange-500 bg-orange-50/90 shadow-md" : "border-slate-200 bg-white/80 hover:border-orange-300 hover:shadow-sm"}`}
                  >
                    <p className="font-bold text-lg text-slate-900 mb-1">Economy</p>
                    <p className="text-xs text-slate-500 font-bold tracking-wider">₹3K–8K {budgetType === 'per_person' ? '/pp' : ''}</p>
                  </button>
                  <button 
                    onClick={() => setBudget(budgetType === "per_person" ? 15000 : 15000 * members)}
                    className={`border-2 p-5 rounded-2xl text-left transition-all ${getTier(perPersonBudget) === "PREMIUM TIER" ? "border-orange-500 bg-orange-50/90 shadow-md" : "border-slate-200 bg-white/80 hover:border-orange-300 hover:shadow-sm"}`}
                  >
                    <p className="font-bold text-lg text-slate-900 mb-1">Premium</p>
                    <p className="text-xs text-slate-500 font-bold tracking-wider">₹8K–25K {budgetType === 'per_person' ? '/pp' : ''}</p>
                  </button>
                  <button 
                    onClick={() => setBudget(budgetType === "per_person" ? 35000 : 35000 * members)}
                    className={`border-2 p-5 rounded-2xl text-left transition-all ${getTier(perPersonBudget) === "LUXURY TIER" ? "border-orange-500 bg-orange-50/90 shadow-md" : "border-slate-200 bg-white/80 hover:border-orange-300 hover:shadow-sm"}`}
                  >
                    <p className="font-bold text-lg text-slate-900 mb-1">Luxury</p>
                    <p className="text-xs text-slate-500 font-bold tracking-wider">₹25K+ {budgetType === 'per_person' ? '/pp' : ''}</p>
                  </button>
                </div>
              </div>

              {/* Travel Dates */}
              <div>
                <p className="text-slate-700 font-bold text-xs tracking-wider mb-4 uppercase drop-shadow-sm">Travel Dates & Weather</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <button 
                    onClick={() => {
                      const d = new Date();
                      const diff = (5 - d.getDay() + 7) % 7 || 7;
                      const start = new Date(d); start.setDate(d.getDate() + diff);
                      const end = new Date(start); end.setDate(start.getDate() + 2);
                      setDateRange({ start, end });
                    }}
                    className="px-6 py-3 bg-white/80 border-2 border-slate-200 rounded-xl text-sm font-bold hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                  >
                    This Weekend
                  </button>
                  <button 
                    onClick={() => {
                      const d = new Date();
                      const diff = (5 - d.getDay() + 7) % 7 || 7;
                      const start = new Date(d); start.setDate(d.getDate() + diff + 7);
                      const end = new Date(start); end.setDate(start.getDate() + 2);
                      setDateRange({ start, end });
                    }}
                    className="px-6 py-3 bg-white/80 border-2 border-slate-200 rounded-xl text-sm font-bold hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                  >
                    Next Weekend
                  </button>
                  <button className="px-6 py-3 bg-white/80 border-2 border-slate-200 rounded-xl text-sm font-bold hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm">+2w</button>
                  <button className="px-6 py-3 bg-white/80 border-2 border-slate-200 rounded-xl text-sm font-bold hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm">+3w</button>
                </div>

                <div className="mb-6 max-w-lg">
                  <CustomCalendar dateRange={dateRange} setDateRange={setDateRange} weather={weather} destinationId={destination.id} />
                </div>

                {/* Check In / Out Inputs restored */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6 max-w-lg">
                  <div>
                    <p className="text-[10px] font-bold text-slate-600 mb-2 tracking-widest uppercase drop-shadow-sm">Check In</p>
                    <DatePicker
                      selected={dateRange.start}
                      onChange={(d) => setDateRange({ ...dateRange, start: d })}
                      className="w-full bg-white/70 backdrop-blur-md border-b-2 border-slate-300 py-3 px-3 text-lg font-bold outline-none focus:border-orange-500 text-slate-900 transition-colors shadow-sm rounded-t-lg"
                      placeholderText="Select date"
                      dateFormat="MM/dd/yyyy"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-600 mb-2 tracking-widest uppercase drop-shadow-sm">Check Out</p>
                    <DatePicker
                      selected={dateRange.end}
                      onChange={(d) => setDateRange({ ...dateRange, end: d })}
                      className="w-full bg-white/70 backdrop-blur-md border-b-2 border-slate-300 py-3 px-3 text-lg font-bold outline-none focus:border-orange-500 text-slate-900 transition-colors shadow-sm rounded-t-lg"
                      placeholderText="Select date"
                      dateFormat="MM/dd/yyyy"
                      minDate={dateRange.start}
                    />
                  </div>
                </div>

                {dateRange.start && dateRange.end && (
                  <div className="bg-orange-500/10 border-2 border-orange-200 px-6 py-5 rounded-2xl flex items-center gap-4 text-base text-orange-900 font-bold shadow-sm backdrop-blur-md max-w-lg">
                    <CheckCircle2 size={24} className="text-orange-600" />
                    {nights} {nights === 1 ? 'night' : 'nights'} · {format(dateRange.start, 'dd MMM yyyy')} → {format(dateRange.end, 'dd MMM yyyy')}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - STICKY SUMMARY */}
            <div className="lg:w-[420px] shrink-0 lg:mt-0 relative z-20">
              <div className="sticky top-24 bg-slate-900/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl text-slate-300 border border-slate-700/50">
                <div className="flex justify-between items-center mb-8">
                  <p className="text-orange-500 font-bold text-[10px] tracking-[0.3em] uppercase">Trip Summary</p>
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                </div>
                
                <div className="rounded-2xl overflow-hidden mb-6 aspect-[4/3] relative shadow-inner">
                  <img src={destination.image} alt={destination.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h2 className="font-display font-bold text-3xl text-white mb-1 drop-shadow-md">{destination.name}</h2>
                    <p className="text-xs font-medium text-slate-300 drop-shadow-md tracking-wide uppercase">{destination.state}</p>
                  </div>
                </div>

                <ul className="space-y-5 mb-10 text-sm font-medium">
                  <li className="flex justify-between items-center border-b border-slate-800/60 pb-4">
                    <span className="flex items-center gap-4 text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
                      Members
                    </span>
                    <span className="font-bold text-white text-base">{members} travelers</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-800/60 pb-4">
                    <span className="flex items-center gap-4 text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg></div>
                      Total Budget
                    </span>
                    <span className="font-bold text-white text-base">₹{totalBudget.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-800/60 pb-4">
                    <span className="flex items-center gap-4 text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg></div>
                      Duration
                    </span>
                    <span className="font-bold text-white text-base">{nights} nights</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-800/60 pb-4">
                    <span className="flex items-center gap-4 text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>
                      Activities
                    </span>
                    <span className="font-bold text-white text-base">{selectedActivities.length} selected</span>
                  </li>
                </ul>

                <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 mb-10 border border-slate-700/50 shadow-inner">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Per person budget</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">₹{perPersonBudget.toLocaleString()}</p>
                    <p className="text-sm font-bold text-slate-500 mb-1">/ pp</p>
                  </div>
                </div>

                <button 
                  onClick={handleBuildItinerary}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold tracking-[0.2em] text-[11px] uppercase py-5 rounded-xl transition-all shadow-[0_10_20px_rgba(249,115,22,0.4)] hover:shadow-[0_15_25px_rgba(249,115,22,0.6)] hover:-translate-y-1 flex justify-center items-center gap-3"
                >
                  Build Itinerary <ArrowLeft size={16} className="rotate-180" />
                </button>
              </div>
            </div>

          </div>

          {/* BOTTOM FULL-WIDTH SECTION (Interactive Activity Map) */}
          <div className="w-full pt-16 border-t border-slate-300/50">
            <div className="mb-12 text-center">
              <p className="text-orange-600 font-bold text-xs tracking-wider mb-3 uppercase drop-shadow-sm">Interactive Guide</p>
              <h2 className="font-display font-bold text-4xl text-slate-900 mb-4 drop-shadow-sm">Explore Activities</h2>
              <p className="text-slate-800 text-lg font-medium drop-shadow-sm max-w-2xl mx-auto">Click on the map pins to explore top experiences across the region and add them directly to your itinerary.</p>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-stretch h-auto xl:h-[600px] mb-20">
              
              {/* Left Side: Featured Activity Details */}
              {activeMapActivity ? (
                <div className="xl:w-[450px] shrink-0 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl flex flex-col relative animate-in fade-in duration-300">
                  <div className="h-64 sm:h-72 w-full relative shrink-0">
                    <img src={activeMapActivity.image} className="w-full h-full object-cover" alt="Featured Activity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-lg border border-white/30">
                      {activeMapActivity.category === 'Adventure' ? '🛶' : activeMapActivity.category === 'Extreme' ? '🪂' : activeMapActivity.category === 'Wellness' ? '🧘' : activeMapActivity.category === 'Culture' ? '🪔' : '⛺'}
                    </div>
                    <div className="absolute bottom-5 left-6 right-6">
                      <span className="px-3 py-1 bg-orange-500 text-white text-[9px] font-bold tracking-widest uppercase rounded-full mb-2 inline-block shadow-md">
                        {activeMapActivity.category}
                      </span>
                      <h3 className="font-display font-bold text-3xl text-white leading-tight">{activeMapActivity.name}</h3>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <p className="text-slate-600 font-medium text-lg italic mb-8 leading-relaxed flex-1">"{activeMapActivity.shortDesc}"</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">⏱️</div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                          <p className="font-bold text-slate-800 text-sm">{activeMapActivity.duration}</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">💰</div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Price</p>
                          <p className="font-bold text-slate-800 text-sm">₹{activeMapActivity.price} <span className="text-[10px] text-slate-500">pp</span></p>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleActivity(activeMapActivity.id)}
                      className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 shadow-md border-2 ${
                        selectedActivities.includes(activeMapActivity.id) 
                          ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' 
                          : 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1'
                      }`}
                    >
                      {selectedActivities.includes(activeMapActivity.id) ? (
                        <> <Check size={16} /> Added to Trip </>
                      ) : (
                        <> <Plus size={16} /> Add to Trip </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="xl:w-[450px] shrink-0 bg-slate-50/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center shadow-inner">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl mb-4 text-slate-400">📍</div>
                  <h3 className="font-display font-bold text-xl text-slate-700 mb-2">Select an Activity</h3>
                  <p className="text-slate-500 font-medium text-sm">Click on any of the interactive pins on the map to view detailed information and add experiences to your itinerary.</p>
                </div>
              )}

              {/* Right Side: Interactive Map */}
              <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden relative min-h-[500px] xl:min-h-0 shadow-inner group">
                {/* Real Google Maps Iframe */}
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(destination.name + ', India')}&t=p&z=12&ie=UTF8&iwloc=&output=embed`}
                  className="absolute inset-0 w-full h-full border-0 grayscale-[30%] opacity-80" 
                  title={`${destination.name} Map`}
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                />
                
                {/* Overlay to catch clicks and style the map slightly */}
                <div className="absolute inset-0 bg-slate-900/5 pointer-events-none"></div>
                
                {/* Click catcher so iframe doesn't swallow hover/click events, but pins are clickable */}
                <div className="absolute inset-0 pointer-events-auto z-0"></div>

                {/* Activity Map Pins */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {MOCK_ACTIVITIES.map((act, index) => {
                    const isActive = activeMapActivity?.id === act.id;
                    const isSelected = selectedActivities.includes(act.id);
                    const pos = mapPositions[index % mapPositions.length];
                    
                    return (
                      <div 
                        key={act.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                        style={{ top: pos.top, left: pos.left }}
                      >
                        {/* Connection line indicator to label */}
                        <div className="absolute top-1/2 left-1/2 w-8 h-[1px] bg-slate-600 transform -rotate-45 origin-left pointer-events-none opacity-50"></div>
                        
                        {/* Label */}
                        <div className={`absolute top-[-30px] left-[35px] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-md whitespace-nowrap transition-all duration-300 pointer-events-none ${isActive ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
                          <p className="text-xs font-bold text-slate-800">{act.name}</p>
                        </div>

                        {/* Map Pin Button */}
                        <button
                          onClick={() => setActiveMapActivity(act)}
                          className={`relative group/pin flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-xl border-2 ${
                            isActive ? 'bg-orange-500 border-white scale-110 z-20 ring-4 ring-orange-500/30' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 hover:scale-110'
                          }`}
                        >
                          {/* Ripple Effect if active */}
                          {isActive && (
                            <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-40"></div>
                          )}
                          
                          <span className="text-xl">
                            {act.category === 'Adventure' ? '🛶' : act.category === 'Extreme' ? '🪂' : act.category === 'Wellness' ? '🧘' : act.category === 'Culture' ? '🪔' : '⛺'}
                          </span>

                          {/* Selection Checkmark */}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white z-20 shadow-sm">
                              <Check size={10} strokeWidth={4} />
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              
            </div>

            {/* Activity Floating Pill */}
            {selectedActivities.length > 0 && (
              <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-xl border border-slate-700 px-4 py-2.5 rounded-full shadow-2xl animate-in slide-in-from-bottom-8">
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {selectedActivities.length}
                </div>
                <span className="font-bold text-sm text-white pr-2 hidden sm:inline">Selected</span>
                <button 
                  onClick={handleClearActivities}
                  className="text-[10px] font-bold text-slate-400 hover:text-orange-400 transition-colors uppercase tracking-widest pl-3 border-l border-slate-600"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ACTIVITY MODAL */}
      {selectedModalActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedModalActivity(null)}></div>
          <div className="relative bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedModalActivity(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="h-64 sm:h-80 w-full relative">
              <img src={selectedModalActivity.image} className="w-full h-full object-cover" alt="Activity Modal Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold tracking-widest uppercase rounded-md mb-3 inline-block shadow-md">
                  {selectedModalActivity.category}
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">{selectedModalActivity.name}</h2>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-lg text-slate-600 italic mb-6">"{selectedModalActivity.shortDesc}"</p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">⏱️</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                    <p className="font-bold text-slate-900">{selectedModalActivity.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">⭐</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                    <p className="font-bold text-slate-900">{selectedModalActivity.rating} / 5.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">💰</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</p>
                    <p className="font-bold text-slate-900">₹{selectedModalActivity.price} pp</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    toggleActivity(selectedModalActivity.id);
                    setSelectedModalActivity(null);
                  }}
                  className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-md ${
                    selectedActivities.includes(selectedModalActivity.id) 
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200' 
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_5_15px_rgba(249,115,22,0.3)]'
                  }`}
                >
                  {selectedActivities.includes(selectedModalActivity.id) ? 'Remove from Trip' : 'Select Activity'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BILL MODAL */}
      {showBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBillModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-5 flex items-center justify-between shrink-0">
              <span className="font-display font-bold text-xl text-white">
                Weekend<span className="text-orange-500">Wander</span>
              </span>
              <button onClick={() => setShowBillModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="text-center mb-8 border-b border-slate-200 pb-8">
                <p className="text-orange-500 font-bold text-[10px] tracking-widest uppercase mb-2">Trip Estimate</p>
                <h2 className="font-display font-bold text-3xl text-slate-900 mb-1">{tripName || 'My Trip'} to {destination.name}</h2>
                <p className="text-sm font-medium text-slate-500">{format(dateRange.start, 'dd MMM yyyy')} — {format(dateRange.end, 'dd MMM yyyy')} ({nights} nights)</p>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Budget Selected</p>
                  <p className="font-bold text-slate-900">₹{totalBudget.toLocaleString()} <span className="text-[10px] text-slate-400 font-medium">total</span></p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Travelers</p>
                  <p className="font-bold text-slate-900">{members} members</p>
                </div>
              </div>

              {selectedActivities.length > 0 && (
                <div className="mb-8 border-t border-slate-200 pt-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Selected Activities</p>
                  <div className="space-y-5">
                    {selectedActivities.map(id => {
                      const act = MOCK_ACTIVITIES.find(a => a.id === id);
                      if (!act) return null;
                      return (
                        <div key={id} className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{act.name}</p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">₹{act.price.toLocaleString()} × {members} travelers</p>
                          </div>
                          <p className="font-bold text-slate-900 text-sm">₹{(act.price * members).toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-slate-600 text-sm">Activities Subtotal</p>
                  <p className="font-bold text-slate-900">
                    ₹{selectedActivities.reduce((sum, id) => sum + (MOCK_ACTIVITIES.find(a => a.id === id)?.price || 0) * members, 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-5 pb-5 border-b border-slate-200">
                  <p>Allocated Base Budget</p>
                  <p>₹{totalBudget.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-1">Estimated Grand Total</p>
                    <p className="text-[10px] font-medium text-slate-400">Excludes flights & accommodations</p>
                  </div>
                  <p className="text-3xl font-display font-bold text-slate-900">
                    ₹{(totalBudget + selectedActivities.reduce((sum, id) => sum + (MOCK_ACTIVITIES.find(a => a.id === id)?.price || 0) * members, 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex gap-4 shrink-0">
              <button 
                onClick={() => {
                  toast.success("Bill downloaded!");
                }}
                className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] border-2 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 transition-colors"
              >
                Download Bill
              </button>
              <button 
                onClick={() => {
                  setShowBillModal(false);
                  toast.success("Booking Request Confirmed!");
                }}
                className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}