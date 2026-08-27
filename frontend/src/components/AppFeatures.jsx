import React from "react";
import { Sun, ShieldCheck, Sparkles } from "lucide-react";

export default function AppFeatures() {
  const items = [
    {
      title: "Authentic Escapes",
      desc: "Discover local stays, hidden experiences, and curated weekend journeys.",
      icon: <Sun className="text-orange-300" size={22} />,
      glow: "from-orange-500/10 to-amber-400/5",
    },
    {
      title: "Travel Smarter",
      desc: "Zero commissions, verified locals, and real-time crowd insights.",
      icon: <ShieldCheck className="text-cyan-300" size={22} />,
      glow: "from-cyan-500/10 to-blue-400/5",
    },
  ];

  return (
    <section
      className="
        relative
        py-14
        overflow-hidden
        bg-[#060816]
        text-white
      "
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* COMPACT HEADER */}
        <div className="text-center mb-10">

          {/* SMALL BADGE */}
          <div
            className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              border border-white/10
              bg-white/[0.04]
              backdrop-blur-xl
              mb-5
            "
          >
            <Sparkles size={13} className="text-orange-300" />

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-white/50
                font-semibold
              "
            >
              Why Questora
            </span>
          </div>

          {/* HEADING */}
          <h2
            className="
              text-3xl
              md:text-4xl
              font-black
              tracking-tight
              leading-tight
              text-[#ebe7e1]
              mb-3
            "
          >
            Travel Better.
            <span className="text-orange-300"> Explore Deeper.</span>
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              max-w-2xl
              mx-auto
              text-[14px]
              md:text-[15px]
              text-white/45
              leading-relaxed
            "
          >
            Designed for modern travelers seeking authentic
            experiences, peaceful escapes, and unforgettable weekends.
          </p>
        </div>

        {/* COMPACT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {items.map((item, i) => (
            <div
              key={i}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border border-white/10
                bg-white/[0.03]
                backdrop-blur-2xl
                p-6
                transition-all duration-500
                hover:bg-white/[0.05]
                hover:-translate-y-1
              "
            >
              {/* GLOW EFFECT */}
              <div
                className={`
                  absolute inset-0 opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-500
                  bg-gradient-to-br ${item.glow}
                `}
              />

              {/* TOP ROW */}
              <div className="relative z-10 flex items-center gap-4 mb-4">

                {/* ICON */}
                <div
                  className="
                    w-12 h-12
                    rounded-2xl
                    flex items-center justify-center
                    border border-white/10
                    bg-white/[0.06]
                    backdrop-blur-xl
                  "
                >
                  {item.icon}
                </div>

                {/* TITLE */}
                <h3
                  className="
                    text-xl
                    font-semibold
                    tracking-tight
                    text-[#ebe7e1]
                  "
                >
                  {item.title}
                </h3>
              </div>

              {/* DESC */}
              <p
                className="
                  relative z-10
                  text-white/45
                  text-[14px]
                  leading-relaxed
                  max-w-md
                "
              >
                {item.desc}
              </p>

              {/* BOTTOM LINE */}
              <div
                className="
                  relative z-10
                  mt-6
                  h-[2px]
                  w-16
                  rounded-full
                  bg-gradient-to-r
                  from-orange-300
                  to-transparent
                  group-hover:w-28
                  transition-all duration-500
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}