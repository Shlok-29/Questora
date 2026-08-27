import React from "react";
import {
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

export default function FooterCTA({ onPlan }) {
  return (
    <footer className="relative overflow-hidden text-white">

      {/* 4K TOURISM BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=100"
          alt="Luxury tourism background"
          className="
            w-full
            h-full
            object-cover
            scale-105
          "
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#040712]/85" />

        {/* CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#040712]/60 to-[#040712]" />
      </div>

      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-0 w-[35rem] h-[35rem] bg-orange-500/10 blur-[160px]" />

      <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] bg-cyan-500/10 blur-[170px]" />

      {/* MAIN CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6">

        {/* TOP CTA SECTION */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border border-white/10
            bg-black/30
            backdrop-blur-3xl
            px-8 md:px-16
            py-16
            mt-20
            shadow-[0_20px_100px_rgba(0,0,0,0.45)]
          "
        >
          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-cyan-500/10" />

          <div
            className="
              relative z-10
              flex
              flex-col
              lg:flex-row
              items-start
              lg:items-center
              justify-between
              gap-10
            "
          >
            {/* LEFT SIDE */}
            <div className="max-w-2xl">

              {/* LABEL */}
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4 py-2
                  rounded-full
                  border border-white/10
                  bg-white/[0.05]
                  backdrop-blur-xl
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-white/50
                  font-semibold
                  mb-6
                "
              >
                Premium Weekend Experiences
              </span>

              {/* TITLE */}
              <h2
                className="
                  text-4xl
                  md:text-6xl
                  font-black
                  leading-[1]
                  tracking-tight
                  text-[#f3eee8]
                  mb-6
                "
              >
                Discover Your
                <br />
                Next Escape.
              </h2>

              {/* DESC */}
              <p
                className="
                  text-[15px]
                  md:text-lg
                  leading-relaxed
                  text-[#d2cbc2]
                  max-w-xl
                "
              >
                Curated destinations, authentic local stays,
                hidden experiences, and unforgettable journeys
                designed for modern travelers.
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-4 w-full lg:w-auto">

              {/* BUTTON */}
              <button
                onClick={onPlan}
                className="
                  group
                  relative
                  overflow-hidden
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  h-[58px]
                  px-8
                  rounded-2xl
                  bg-white
                  text-slate-900
                  font-semibold
                  text-[15px]
                  shadow-[0_20px_60px_rgba(255,255,255,0.12)]
                  transition-all duration-500
                  hover:scale-[1.03]
                  hover:bg-orange-500
                  hover:text-white
                "
              >
                {/* HOVER EFFECT */}
                <div
                  className="
                    absolute inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-500
                    bg-gradient-to-r
                    from-orange-500
                    to-amber-400
                  "
                />

                <span className="relative z-10">
                  Explore Destinations
                </span>

                <ArrowRight
                  size={18}
                  className="
                    relative z-10
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </button>

              {/* NEWSLETTER */}
              <div
                className="
                  flex items-center
                  h-[58px]
                  rounded-2xl
                  bg-white/[0.05]
                  border border-white/10
                  overflow-hidden
                  backdrop-blur-xl
                "
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    bg-transparent
                    px-5
                    w-full
                    outline-none
                    text-sm
                    text-white
                    placeholder:text-white/30
                  "
                />

                <button
                  className="
                    h-full
                    px-5
                    border-l border-white/10
                    text-orange-300
                    hover:bg-orange-500
                    hover:text-white
                    transition-all
                  "
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER GRID */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-5
            gap-10
            py-20
          "
        >
          {/* BRAND */}
          <div className="lg:col-span-2">

            {/* LOGO */}
            <h3
              className="
                text-3xl
                font-black
                tracking-tight
                text-[#f3eee8]
                mb-5
              "
            >
              Quest<span className="text-orange-400">ora</span>
            </h3>

            {/* DESC */}
            <p
              className="
                text-[#d2cbc2]
                leading-relaxed
                max-w-md
                text-[15px]
              "
            >
              Questora helps modern travelers discover
              authentic local experiences, premium homestays,
              hidden destinations, and unforgettable
              weekend escapes.
            </p>

            {/* CONTACT */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Mail size={16} className="text-orange-300" />
                support@questora.com
              </div>

              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Phone size={16} className="text-orange-300" />
                +91 98765 43210
              </div>

              <div className="flex items-center gap-3 text-white/50 text-sm">
                <MapPin size={16} className="text-orange-300" />
                Bhopal, India
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              Company
            </h4>

            <div className="space-y-3 text-sm text-white/45">
              <a href="#" className="block hover:text-white transition-colors">
                About Us
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Careers
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Blog
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Press
              </a>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              Explore
            </h4>

            <div className="space-y-3 text-sm text-white/45">
              <a href="#" className="block hover:text-white transition-colors">
                Destinations
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Homestays
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Rentals
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Local Guides
              </a>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-white font-semibold mb-5">
              Legal
            </h4>

            <div className="space-y-3 text-sm text-white/45">
              <a href="#" className="block hover:text-white transition-colors">
                Privacy Policy
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Terms & Conditions
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Cookies
              </a>

              <a href="#" className="block hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="
            border-t border-white/10
            py-8
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-6
          "
        >
          {/* COPYRIGHT */}
          <p className="text-white/30 text-sm text-center md:text-left">
            © 2026 Questora. All rights reserved.
          </p>

          {/* SOCIALS */}
          <div className="flex items-center gap-3">
            {[
              <Instagram size={17} />,
              <Twitter size={17} />,
              <Facebook size={17} />,
              <Linkedin size={17} />,
            ].map((icon, i) => (
              <button
                key={i}
                className="
                  w-11 h-11
                  rounded-2xl
                  flex items-center justify-center
                  bg-white/[0.05]
                  border border-white/10
                  text-white/40
                  transition-all duration-300
                  hover:bg-orange-500
                  hover:text-white
                  hover:border-orange-400
                "
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}