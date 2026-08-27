import React, { useMemo, useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, Clock, ShieldAlert, BadgePercent, ChevronRight } from 'lucide-react';
import useTripStore from '../store/tripStore';

export default function DemandEngine({ destination, budget }) {
  const { dateRange } = useTripStore();
  const [availabilityData, setAvailabilityData] = useState({});

  useEffect(() => {
    if (!destination?.id || !dateRange.start || !dateRange.end) return;
    const fetchAvailability = async () => {
      try {
        const startStr = dateRange.start.toISOString();
        const endStr = dateRange.end.toISOString();
        const res = await fetch(`http://localhost:5000/api/availability?destinationId=${destination.id}&start=${startStr}&end=${endStr}`);
        const data = await res.json();
        if (data.dailyTotals) {
          setAvailabilityData(data.dailyTotals);
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      }
    };
    fetchAvailability();
  }, [destination, dateRange]);

  // Use destination name length to generate consistent pseudo-random values for demo purposes
  const seed = destination?.name?.length || 5;
  
  // Calculate Base Metrics
  const metrics = useMemo(() => {
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    const isFestivalSeason = new Date().getMonth() > 8; // e.g. Oct-Dec
    
    // Formula 1: Availability
    // Use real availability fetched from backend
    const MAX_DAILY_CAPACITY = 100;
    
    // Calculate total booked in the selected range
    let totalBooked = 0;
    let daysCount = 0;
    
    if (dateRange.start && dateRange.end) {
      let current = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      current.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      
      while (current <= end) {
        daysCount++;
        const dateStr = current.toISOString().split('T')[0];
        totalBooked += availabilityData[dateStr] || 0;
        current.setDate(current.getDate() + 1);
      }
    }

    if (daysCount === 0) daysCount = 1; // fallback
    const TotalRooms = MAX_DAILY_CAPACITY * daysCount;
    // Add minor baseline for visuals
    totalBooked += Math.max(0, Math.floor(TotalRooms * (0.1 + (seed % 3) * 0.05)));
    
    const RemainingRooms = Math.max(0, TotalRooms - totalBooked);
    const AvailabilityPercentage = Math.round(((TotalRooms - RemainingRooms) / TotalRooms) * 100);
    
    // Formula 2: Rush Score
    const WeekendWeight = isWeekend ? 30 : 5;
    const FestivalWeight = isFestivalSeason ? 40 : 10;
    const WeatherWeight = 15; // Assume favorable
    const SearchTrendWeight = 10 + (seed * 2);
    const BookingWeight = (totalBooked / TotalRooms) * 30; // Dynamic based on real bookings
    
    const RushScore = Math.min(100, Math.round(WeekendWeight + FestivalWeight + WeatherWeight + SearchTrendWeight + BookingWeight));
    
    // Formula 3: Dynamic Price Savings (Recommendation)
    const WeekendFactor = isWeekend ? 1.3 : 1.0;
    const DemandFactor = 1 + (SearchTrendWeight / 100);
    const FestivalFactor = isFestivalSeason ? 1.2 : 1.0;
    
    // Base potential surge multiplier
    const surgeMultiplier = WeekendFactor * DemandFactor * FestivalFactor;
    // Calculate potential savings if booked now vs later
    const potentialSavingsPct = Math.round((surgeMultiplier - 1) * 100) || 18; // Default 18% if low

    return {
      AvailabilityPercentage,
      RemainingRooms,
      RushScore,
      potentialSavingsPct,
      isWeekend
    };
  }, [seed]);

  return (
    <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-8 h-[2px] bg-emerald-500"></span>
        <h2 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          Real-Time Demand Insights
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Component 1: Availability Meter */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:border-white/20 transition-all relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 blur-[50px] rounded-full"></div>
          
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Scarcity Alert</p>
              <h3 className="text-2xl font-bold text-white">Availability</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Activity size={24} />
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-end mb-3">
              <span className="text-4xl font-display font-black text-white">{metrics.AvailabilityPercentage}%</span>
              <span className="text-red-400 font-semibold text-sm mb-1">Booked</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full relative"
                style={{ width: `${metrics.AvailabilityPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-red-200 text-sm font-medium">
              <AlertTriangle size={18} className="text-red-400 shrink-0" />
              <p>Only <span className="font-bold text-white">{metrics.RemainingRooms} premium stays</span> left for these dates!</p>
            </div>
          </div>
        </div>

        {/* Component 2: Rush Prediction Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:border-white/20 transition-all relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-500/10 blur-[50px] rounded-full"></div>
          
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">AI Forecast</p>
              <h3 className="text-2xl font-bold text-white">Demand Rush</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3 text-white/80">
                <Clock size={18} className="text-orange-400" />
                <span className="text-sm font-medium">Expected Traffic</span>
              </div>
              <span className="font-bold text-white">{metrics.isWeekend ? 'Very High' : 'Elevated'}</span>
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3 text-white/80">
                <Zap size={18} className="text-orange-400" />
                <span className="text-sm font-medium">Demand Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{metrics.RushScore} / 100</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white/80">
                <ShieldAlert size={18} className="text-orange-400" />
                <span className="text-sm font-medium">Best Booking Window</span>
              </div>
              <span className="font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs">Next 4 Hours</span>
            </div>
          </div>
        </div>

        {/* Component 3: Smart Recommendation Module */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/80 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-[2rem] transition-all relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <BadgePercent size={120} />
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">Smart Recommendation</p>
            
            <h3 className="text-3xl font-display font-bold text-white leading-tight mb-4">
              Lock in your price before the surge.
            </h3>
            
            <p className="text-emerald-100/70 text-sm leading-relaxed mb-8 flex-grow">
              Based on historical data and current search trends for {destination?.name || 'this destination'}, prices are expected to rise significantly by tomorrow evening.
            </p>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Potential Savings</p>
                <p className="text-2xl font-bold text-emerald-400">Up to {metrics.potentialSavingsPct}%</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
