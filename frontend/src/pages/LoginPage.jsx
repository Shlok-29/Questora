import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Lock, ArrowRight, ShieldCheck, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

import { API_BASE_URL } from "../config";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { phoneNumber });
      toast.success(response.data.message || "OTP sent successfully!");
      setStep(2);
      setTimer(60);
      
      // For demo/dev mode if OTP is returned in response
      if (response.data.otp) {
        console.log("DEV MODE OTP:", response.data.otp);
        toast(`Dev Mode OTP: ${response.data.otp}`, { icon: '🔑', duration: 6000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { phoneNumber, otp });
      if (response.data.success) {
        toast.success("Welcome to WeekendWander!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const resetStep = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C9A84C] opacity-[0.03] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C9A84C] opacity-[0.03] blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/20 mb-6"
          >
            <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />
          </motion.div>
          <h1 className="text-4xl font-bold text-[#F5F0E8] mb-2 tracking-tight">Questora</h1>
          <p className="text-[#9A9A9A]">Quest your desires with Questora</p>
        </div>

        <div className="bg-[#141416]/80 backdrop-blur-xl border border-[#C9A84C]/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-[#F5F0E8] mb-1">Welcome back</h2>
                  <p className="text-[#9A9A9A] text-sm">Enter your phone number to continue</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]" />
                    <input
                      type="tel"
                      placeholder="Phone Number (e.g. +91...)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#C9A84C]/20 rounded-xl py-4 pl-12 pr-4 text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C] transition-all placeholder:text-[#555]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#C9A84C] text-[#0A0A0B] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#D4B86A] transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <button 
                    onClick={resetStep}
                    className="text-[#C9A84C] text-sm flex items-center gap-1 mb-4 hover:underline"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    Change number
                  </button>
                  <h2 className="text-2xl font-semibold text-[#F5F0E8] mb-1">Verify OTP</h2>
                  <p className="text-[#9A9A9A] text-sm">Sent to {phoneNumber}</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit Code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-[#C9A84C]/20 rounded-xl py-4 pl-12 pr-4 text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C] transition-all placeholder:text-[#555] tracking-[1em] text-center"
                    />
                  </div>

                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-[#9A9A9A] text-xs">Resend code in <span className="text-[#C9A84C]">{timer}s</span></p>
                    ) : (
                      <button 
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#C9A84C] text-xs font-medium hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#C9A84C] text-[#0A0A0B] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#D4B86A] transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[#555] text-xs mt-8">
          By continuing, you agree to WeekendWander's Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
