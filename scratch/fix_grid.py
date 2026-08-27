import re

with open(r'c:\Users\ACER\OneDrive\Desktop\LAB-003-AI-AVENGERS\frontend\src\components\DestinationGrid.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix conflict 1
conflict1_regex = re.compile(r'<<<<<<< HEAD.*?=======.*?(import React.*?handleCustomSearch = \(\) => \{.*?onSelect\(customDest\);\n  };)\n>>>>>>> YashNN', re.DOTALL)

def repl1(m):
    return m.group(1).replace('import React, { useState } from "react";\nimport { ArrowRight } from "lucide-react";', 'import React, { useState } from "react";\nimport { ArrowRight, Sparkles } from "lucide-react";')

content = conflict1_regex.sub(repl1, content)

# Fix conflict 2
conflict2_regex = re.compile(r'<<<<<<< HEAD\n(    <section\n.*?)(          {/\* TITLE \*/}\n)', re.DOTALL)

def repl2(m):
    head_section = m.group(1)
    title_start = m.group(2)
    
    # We want to inject the search bar right before the TITLE, wait no, right after the DESC in HEAD?
    # Let's just manually construct the whole header area to be safe.
    pass

# Actually, let's just do a manual string replace for conflict 2.
conflict2_full = re.compile(r'<<<<<<< HEAD\n    <section.*?>>>>>>> YashNN\n', re.DOTALL)

replacement2 = """    <section
      id="destinations"
      className="relative overflow-hidden py-24 text-white bg-[#050816]"
    >
      {/* CLEAN 4K NATURE BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=100"
          alt="Nature background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/40 via-[#050816]/55 to-[#050816]" />
      </div>

      {/* SOFT GLOW */}
      <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-cyan-500/10 blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-orange-500/10 blur-[160px]" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">

          {/* LABEL */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl mb-6">
            <Sparkles size={13} className="text-orange-300" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">
              Trending Destinations
            </span>
          </div>

          {/* TITLE */}
          <h2 className="text-4xl md:text-6xl font-black leading-[1] tracking-tight text-[#f3eee8] mb-6">
            Discover Beautiful<br />Weekend Escapes.
          </h2>

          {/* DESC */}
          <p className="max-w-2xl mx-auto text-[15px] md:text-lg leading-relaxed text-[#d2cbc2] mb-10">
            Explore peaceful mountains, hidden forests, tropical beaches, and breathtaking destinations crafted for unforgettable travel experiences.
          </p>

          {/* Dark Mode Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20 p-2 relative z-20">
              <div className="pl-5 pr-3 text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>
              </div>
              <input
                type="text"
                placeholder="Where to next? (e.g. Goa, Paris)"
                className="flex-1 bg-transparent outline-none py-3 text-white font-medium placeholder-white/50"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomSearch();
                }}
              />
              <button
                onClick={handleCustomSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 rounded-full font-bold text-sm transition-all shadow-md whitespace-nowrap"
              >
                Plan Weekend
              </button>
            </div>
            
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-30 max-h-80 overflow-y-auto animate-in slide-in-from-top-2 text-left">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map(dest => (
                    <div 
                      key={dest.id}
                      onClick={() => onSelect(dest)}
                      className="px-5 py-4 hover:bg-white/10 cursor-pointer flex items-center justify-between border-b border-white/5 last:border-0 group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">{dest.name}</p>
                          <p className="text-xs text-white/50 font-medium">{dest.state}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-orange-400 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 uppercase tracking-widest shadow-sm hidden sm:block">
                        {dest.tag}
                      </span>
                    </div>
                  ))
                ) : (
                  <div 
                    onClick={handleCustomSearch}
                    className="px-5 py-6 text-center cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <p className="text-white/50 font-medium mb-1">Destination not found in trending.</p>
                    <p className="text-orange-400 font-bold">Plan a custom trip to "{searchQuery}" <ArrowRight size={16} className="inline ml-1 mb-0.5" /></p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
"""

content = conflict2_full.sub(replacement2, content)

with open(r'c:\Users\ACER\OneDrive\Desktop\LAB-003-AI-AVENGERS\frontend\src\components\DestinationGrid.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Conflicts resolved!")
