import React from "react";
import {
  MapPin,
  Coffee,
  Bike,
  Tent,
  ArrowUpRight,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <MapPin size={22} />,
      title: "Luxury Homestays",
      desc: "Stay in beautifully curated local homes with authentic hospitality.",
      glow: "from-cyan-500/20 to-blue-500/5",
      iconColor: "text-cyan-300",
    },

    {
      icon: <Bike size={22} />,
      title: "Private Rentals",
      desc: "Book bikes and transport directly from trusted local owners.",
      glow: "from-orange-500/20 to-amber-500/5",
      iconColor: "text-orange-300",
    },

    {
      icon: <Tent size={22} />,
      title: "Hidden Experiences",
      desc: "Discover trails, adventures, and secret local destinations.",
      glow: "from-emerald-500/20 to-green-500/5",
      iconColor: "text-emerald-300",
    },

    {
      icon: <Coffee size={22} />,
      title: "Authentic Dining",
      desc: "Enjoy handcrafted meals and real regional flavors.",
      glow: "from-rose-500/20 to-pink-500/5",
      iconColor: "text-rose-300",
    },
  ];

  return (
    <section
      id="services"
      className="
        relative
        overflow-hidden
        py-24
        text-white
      "
    >
      {/* 4K TOURISM BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=100"
          alt="Luxury travel background"
          className="
            w-full
            h-full
            object-cover
            scale-105
          "
        />

        {/* LIGHT OVERLAY */}
        <div className="absolute inset-0 bg-[#050816]/70" />

        {/* CINEMATIC GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#050816]/80" />
      </div>

      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-0 w-[35rem] h-[35rem] bg-orange-500/10 blur-[170px]" />

      <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] bg-cyan-500/10 blur-[170px]" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">

          {/* LABEL */}
          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4 py-2
              rounded-full
              border border-white/10
              bg-white/[0.05]
              backdrop-blur-xl
              mb-6
            "
          >
            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-white/50
                font-semibold
              "
            >
              Curated Travel Services
            </span>
          </div>

          {/* TITLE */}
          <h2
            className="
              text-4xl
              md:text-6xl
              font-black
              tracking-tight
              leading-[1]
              text-[#f3eee8]
              mb-6
            "
          >
            Everything You Need
            <br />
            For The Perfect Escape.
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              max-w-2xl
              mx-auto
              text-[15px]
              md:text-lg
              leading-relaxed
              text-[#d2cbc2]
            "
          >
            From luxury stays and local transport
            to hidden adventures and authentic dining —
            experience travel beyond mainstream tourism.
          </p>
        </div>

        {/* FEATURE GRID */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="
                group
                relative
                overflow-hidden
                rounded-[2rem]
                border border-white/10
                bg-black/30
                backdrop-blur-2xl
                p-7
                transition-all duration-700
                hover:-translate-y-2
                hover:border-white/20
                hover:bg-black/40
                hover:shadow-[0_25px_80px_rgba(0,0,0,0.45)]
              "
            >
              {/* HOVER GLOW */}
              <div
                className={`
                  absolute inset-0 opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-700
                  bg-gradient-to-br ${f.glow}
                `}
              />

              {/* TOP SECTION */}
              <div
                className="
                  relative z-10
                  flex items-start justify-between
                  mb-8
                "
              >
                {/* ICON */}
                <div
                  className="
                    w-14 h-14
                    rounded-2xl
                    flex items-center justify-center
                    border border-white/10
                    bg-white/[0.05]
                    backdrop-blur-xl
                    transition-transform duration-500
                    group-hover:scale-110
                  "
                >
                  <div className={f.iconColor}>
                    {f.icon}
                  </div>
                </div>

                {/* ARROW */}
                <div
                  className="
                    w-10 h-10
                    rounded-xl
                    flex items-center justify-center
                    bg-white/[0.05]
                    border border-white/10
                    text-white/30
                    transition-all duration-500
                    group-hover:bg-orange-500
                    group-hover:text-white
                    group-hover:rotate-45
                  "
                >
                  <ArrowUpRight size={18} />
                </div>
              </div>

              {/* TITLE */}
              <h3
                className="
                  relative z-10
                  text-2xl
                  font-bold
                  tracking-tight
                  text-[#f3eee8]
                  mb-4
                "
              >
                {f.title}
              </h3>

              {/* DESCRIPTION */}
              <p
                className="
                  relative z-10
                  text-[15px]
                  leading-relaxed
                  text-[#d2cbc2]
                "
              >
                {f.desc}
              </p>

              {/* BOTTOM LINE */}
              <div
                className="
                  relative z-10
                  mt-8
                  h-[2px]
                  w-14
                  rounded-full
                  bg-gradient-to-r
                  from-orange-400
                  to-transparent
                  transition-all duration-700
                  group-hover:w-28
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}