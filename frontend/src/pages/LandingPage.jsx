import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import Navbar from "../components/Navbar";
import CarouselHero from "../components/CarouselHero";
import AppFeatures from "../components/AppFeatures";
import Features from "../components/Features";
import DestinationGrid from "../components/DestinationGrid";
import HowItWorks from "../components/HowItWorks";
import FooterCTA from "../components/FooterCTA";

export default function LandingPage() {
  const navigate = useNavigate();
  const setDestination = useTripStore((s) => s.setDestination);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDestinationSelect = (dest) => {
    setDestination(dest);
    navigate("/plan");
  };

  const handlePlan = () => {
    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-slate-50 min-h-screen font-body text-slate-900">
      <Navbar scrolled={scrolled} />
      <CarouselHero onExplore={handlePlan} />
      <AppFeatures />
      
      <DestinationGrid onSelect={handleDestinationSelect} />
      <HowItWorks />
      <Features />
      <FooterCTA onPlan={handlePlan} />
    </div>
  );
}