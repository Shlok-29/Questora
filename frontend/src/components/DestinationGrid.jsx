import React, { useState } from "react";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { DESTINATIONS } from "../lib/api";

export default function DestinationGrid({ onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredDestinations = DESTINATIONS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomSearch = () => {
    if (!searchQuery.trim()) return;
    
    // If active index is valid, select that one instead
    if (activeIndex >= 0 && activeIndex < filteredDestinations.length) {
      onSelect(filteredDestinations[activeIndex]);
      return;
    }

    const exactMatch = DESTINATIONS.find(d => d.name.toLowerCase() === searchQuery.toLowerCase());
    if (exactMatch) {
      onSelect(exactMatch);
      return;
    }
    const customDest = {
      id: "custom-" + Date.now(),
      name: searchQuery,
      state: "Custom Destination",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
      tagline: "Explore your way",
      crowdLevel: "low",
      tag: "Custom",
      trendingScore: 90
    };
    onSelect(customDest);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredDestinations.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      handleCustomSearch();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-orange-400 font-black">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const getCrowdStyles = (level) => {
    switch (level) {
      case "low":
        return {
          text: "Peaceful",
          dot: "bg-emerald-400",
          badge: "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
        };
      case "medium":
        return {
          text: "Moderate",
          dot: "bg-amber-400",
          badge: "bg-amber-500/15 text-amber-200 border-amber-400/20",
        };
      case "high":
        return {
          text: "Popular",
          dot: "bg-rose-400",
          badge: "bg-rose-500/15 text-rose-200 border-rose-400/20",
        };
      default:
        return {
          text: "Unknown",
          dot: "bg-slate-400",
          badge: "bg-slate-500/15 text-slate-200 border-slate-400/20",
        };
    }
  };

  return (
    <section
      id="destinations"
      className="relative overflow-hidden py-24 text-white bg-[#050816]"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=100"
          alt="Nature background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/40 via-[#050816]/55 to-[#050816]" />
      </div>

      <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-cyan-500/10 blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-orange-500/10 blur-[160px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl mb-6">
              <Sparkles size={13} className="text-orange-300" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">
                Trending Destinations
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-[1] tracking-tight text-[#f3eee8] mb-6">
              Discover Beautiful<br />Weekend Escapes.
            </h2>
            <p className="max-w-2xl text-[15px] md:text-lg leading-relaxed text-[#d2cbc2]">
              Explore peaceful mountains, hidden forests, tropical beaches, and breathtaking destinations crafted for unforgettable travel experiences.
            </p>
          </div>

          <div className="w-full lg:w-[400px] relative">
            <div className="flex items-center bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/10 p-2 hover:border-white/20 transition-all shadow-2xl">
              <div className="pl-4 pr-2 text-orange-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Enter your destination"
                className="flex-1 bg-transparent outline-none py-3 text-white font-medium placeholder-white/30"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleCustomSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                Go
              </button>
            </div>

            {showDropdown && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 max-h-80 overflow-y-auto">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest, idx) => (
                    <div 
                      key={dest.id}
                      onClick={() => onSelect(dest)}
                      className={`px-5 py-4 hover:bg-white/5 cursor-pointer flex items-center justify-between border-b border-white/5 last:border-0 group transition-colors ${activeIndex === idx ? 'bg-white/10' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className={`font-bold transition-colors ${activeIndex === idx ? 'text-orange-400' : 'text-white group-hover:text-orange-400'}`}>
                            {highlightMatch(dest.name, searchQuery)}
                          </p>
                          <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                            {highlightMatch(dest.state, searchQuery)}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={14} className={`transition-all ${activeIndex === idx ? 'text-orange-400 translate-x-1' : 'text-white/20 group-hover:text-orange-400 group-hover:translate-x-1'}`} />
                    </div>
                  ))
                ) : (
                  <div 
                    onClick={handleCustomSearch}
                    className="px-5 py-6 text-center cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <p className="text-white/40 text-sm mb-1">Not in trending destinations.</p>
                    <p className="text-orange-400 font-bold text-sm">Plan custom trip to "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {DESTINATIONS.map((dest) => {
            const crowd = getCrowdStyles(dest.crowdLevel);
            return (
              <div
                key={dest.id}
                onClick={() => onSelect(dest)}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 backdrop-blur-2xl cursor-pointer transition-all duration-700 hover:-translate-y-2 hover:border-white/20 hover:bg-black/40 hover:shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                  <div className={`absolute top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl text-xs font-semibold ${crowd.badge}`}>
                    <span className={`w-2 h-2 rounded-full ${crowd.dot}`} />
                    {crowd.text}
                  </div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-3xl font-black tracking-tight text-[#f3eee8]">{dest.name}</h3>
                      <span className="text-xs uppercase tracking-[0.2em] text-white/50">{dest.state}</span>
                    </div>
                    <p className="text-[#d2cbc2] text-sm leading-relaxed max-w-sm">{dest.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-6 py-5 border-t border-white/10">
                  <div>
                    <p className="text-white/35 text-xs uppercase tracking-[0.2em]">Weekend Experience</p>
                    <h4 className="text-white font-semibold mt-1">Explore Options</h4>
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10 text-white/50 transition-all duration-500 group-hover:bg-orange-500 group-hover:text-white">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}