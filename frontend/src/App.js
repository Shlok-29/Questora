import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import PlanPage from "./pages/PlanPage";
import ItineraryPage from "./pages/ItineraryPage";
import RentalsPage from "./pages/RentalsPage";
import BookingPage from "./pages/BookingPage";
import HostsAndGuidesPage from "./pages/HostsAndGuidesPage";
import ScrollToTop from "./components/ScrollToTop";
import TravelAssistanceIcon from "./components/TravelAssistanceIcon";
import WhatsAppAI from "./components/WhatsAppAI";
import useTripStore from "./store/tripStore";
import { Navigate } from "react-router-dom";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
});

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      if (followerRef.current) {
        setTimeout(() => {
          followerRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
        }, 80);
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}

export default function App() {
  const isPaid = useTripStore((state) => state.isPaid);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <div className="grain">
          <CustomCursor />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1A1E",
                color: "#F5F0E8",
                border: "1px solid rgba(201,168,76,0.3)",
                fontFamily: "'DM Sans', sans-serif",
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
            <Route path="/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />
            <Route path="/itinerary/:destination" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
            <Route path="/rentals" element={<ProtectedRoute><RentalsPage /></ProtectedRoute>} />
            <Route path="/hosts-and-guides" element={<ProtectedRoute><HostsAndGuidesPage /></ProtectedRoute>} />
            <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          </Routes>
          {isPaid && <WhatsAppAI />}
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
