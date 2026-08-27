import React from "react";
import { MapPin, Package, MessageCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose Destination",
      desc: "Pick your perfect weekend escape.",
      icon: <MapPin size={16} />,
    },
    {
      num: "02",
      title: "Build Package",
      desc: "Add stays, rentals, and experiences.",
      icon: <Package size={16} />,
    },
    {
      num: "03",
      title: "Contact Directly",
      desc: "Connect instantly with local hosts.",
      icon: <MessageCircle size={16} />,
    },
  ];

  return (
    <section
      className="
        relative
        py-20
        overflow-hidden
        text-white
      "
    >
      {/* 4K TOURISM BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=100"
          alt="Tourism background"
          className="
            w-full
            h-full
            object-cover
            scale-105
          "
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#050816]/75" />

        {/* CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#050816]/60 to-[#050816]/85" />
      </div>

      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-orange-500/10 blur-[150px]" />

      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-cyan-500/10 blur-[160px]" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-14">

          {/* LABEL */}
          <span
            className="
              inline-flex
              items-center
              px-4 py-2
              rounded-full
              border border-white/10
              bg-white/[0.05]
              backdrop-blur-xl
              text-white/50
              text-[10px]
              uppercase
              tracking-[0.28em]
              font-semibold
              mb-6
            "
          >
            Simple Process
          </span>

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
            Plan Your Weekend
            <br />
            In Minutes
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
            Discover destinations, connect with locals,
            and create unforgettable travel experiences
            without complicated booking flows.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {steps.map((step, i) => (
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
                hover:bg-black/40
                hover:border-white/20
                hover:shadow-[0_25px_80px_rgba(0,0,0,0.45)]
              "
            >
              {/* HOVER GLOW */}
              <div
                className="
                  absolute inset-0 opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-700
                  bg-gradient-to-br
                  from-orange-500/10
                  to-cyan-500/10
                "
              />

              {/* TOP ROW */}
              <div
                className="
                  relative z-10
                  flex items-center justify-between
                  mb-8
                "
              >
                {/* ICON */}
                <div
                  className="
                    w-14 h-14
                    rounded-2xl
                    flex items-center justify-center
                    bg-white/[0.05]
                    border border-white/10
                    backdrop-blur-xl
                    text-orange-300
                    transition-transform duration-500
                    group-hover:scale-110
                  "
                >
                  {step.icon}
                </div>

                {/* NUMBER */}
                <span
                  className="
                    text-white/20
                    text-2xl
                    font-black
                  "
                >
                  {step.num}
                </span>
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
                {step.title}
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
                {step.desc}
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