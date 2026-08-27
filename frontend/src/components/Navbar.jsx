import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Building2, Compass, LogOut } from "lucide-react";
import ListingModal from "./ListingModal";

export default function Navbar({ scrolled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path, e) => {
    if (path.startsWith("/#")) {
      e.preventDefault();
      const id = path.split("#")[1];
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      navigate(path);
    }
  };

  const navItems = [
    { name: "Destinations", path: "/#destinations" },
    { name: "Homestays & Guides", path: "/hosts-and-guides" },
    { name: "Rentals", path: "/rentals" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-slate-950/40 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl"
            : "bg-transparent py-5"
        }`}
      >
        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            scrolled
              ? "opacity-100 bg-gradient-to-r from-black/30 via-slate-900/20 to-black/30"
              : "opacity-0"
          }`}
        />

        <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div
              className={`relative w-11 h-11 rounded-2xl overflow-hidden transition-all duration-500 border p-0.5 ${
                scrolled
                  ? "bg-white/10 border-white/10 backdrop-blur-xl"
                  : "bg-white/15 border-white/20 backdrop-blur-md"
              }`}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/40 to-yellow-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              <img
                src="/favicon.png"
                alt="Questora Logo"
                className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col">
              <span
                className={`font-display font-bold text-2xl tracking-tight transition-all duration-300 ${
                  scrolled ? "text-white" : "text-white"
                }`}
              >
                Quest<span className="text-orange-400">ora</span>
              </span>

              <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                Escape Beyond
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => handleNavClick(item.path, e)}
                className="
                  relative px-5 py-2 rounded-full overflow-hidden
                  text-sm font-medium text-white/90
                  border border-transparent
                  transition-all duration-500
                  hover:text-white hover:border-white/20
                  hover:bg-white/10 hover:backdrop-blur-xl
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]
                  group
                "
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                <span className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-orange-400 transition-all duration-500 group-hover:w-10 group-hover:left-[calc(50%-20px)]" />
                <span className="relative z-10">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            
            {/* List Property */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`
                group relative overflow-hidden
                flex items-center gap-2
                font-semibold text-sm
                px-5 py-3 rounded-full
                border border-white/20
                text-white
                backdrop-blur-xl
                bg-white/10
                transition-all duration-500
                hover:bg-white/20
                hover:border-white/40
                hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
                hover:scale-105
              `}
            >
              {/* Glass Shine */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" />

              <Building2
                size={18}
                className="relative z-10 group-hover:rotate-6 transition-transform duration-300"
              />

              <span className="relative z-10">List Property</span>
            </button>

            {/* Main CTA */}
            <button
              onClick={() =>
                document
                  .getElementById("destinations")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="
                group relative overflow-hidden
                flex items-center gap-2
                font-bold text-sm
                px-6 py-3 rounded-full
                bg-gradient-to-r from-orange-500 to-amber-400
                text-white
                shadow-[0_10px_30px_rgba(249,115,22,0.35)]
                transition-all duration-500
                hover:scale-105
                hover:shadow-[0_15px_40px_rgba(249,115,22,0.55)]
                active:scale-95
              "
            >
              {/* Animated Glow */}
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <Compass
                size={18}
                className="relative z-10 group-hover:rotate-12 transition-transform duration-500"
              />

              <span className="relative z-10">Plan Weekend</span>
            </button>

            {/* Logout Button (Conditional) */}
            {localStorage.getItem("user") && (
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  useTripStore.getState().setPaid(false);
                  useTripStore.getState().reset();
                  navigate("/login");
                }}
                className="
                  group relative overflow-hidden
                  flex items-center gap-2
                  font-semibold text-sm
                  px-4 py-3 rounded-full
                  border border-red-500/20
                  text-red-400
                  backdrop-blur-xl
                  bg-red-500/5
                  transition-all duration-500
                  hover:bg-red-500/10
                  hover:border-red-500/40
                  hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]
                  hover:scale-105
                "
                title="Logout"
              >
                <LogOut size={16} className="relative z-10" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <ListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}