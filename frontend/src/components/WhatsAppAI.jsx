import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Bot, ExternalLink, CheckCircle2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTripStore from "../store/tripStore";
import toast from "react-hot-toast";

const WHATSAPP_NUMBER = "+14155238886";

export default function WhatsAppAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); 
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your Questora AI assistant. How can I help you with your trip today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { destination, isPaid } = useTripStore();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const predefinedQuestions = [
    { text: "Check my remaining budget", icon: "💰" },
    { text: "Show my today's itinerary", icon: "📅" },
    { text: "Find nearest restaurants", icon: "🍴" },
    { text: "What's the weather like?", icon: "☁️" },
  ];

  const handleSendMessage = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let response = "I'm looking into that for you! You can also check your WhatsApp for real-time updates.";
      const lowerMsg = msg.toLowerCase();
      
      if (lowerMsg.includes("budget")) response = "Your current budget looks healthy! You've spent about 30% of your daily limit.";
      if (lowerMsg.includes("weather")) response = `The weather in ${destination?.name || 'your destination'} is expected to be pleasant today!`;
      if (lowerMsg.includes("itinerary") || lowerMsg.includes("schedule")) response = "You have 3 activities planned for today. Check your WhatsApp for the full list!";
      if (lowerMsg.includes("food") || lowerMsg.includes("restaurant")) response = "There are some great local cafes nearby! Would you like me to send some recommendations to your WhatsApp?";

      setMessages(prev => [...prev, { role: "ai", text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleWhatsAppRedirect = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=Hi Questora!`, "_blank");
  };

  if (!isPaid) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[400px] bg-[#0F0F11] border border-[#C9A84C]/20 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col h-[600px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#C9A84C] to-[#D4B86A] p-6 text-[#0A0A0B]">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0A0A0B] rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot size={28} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Questora AI</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#0A0A0B] rounded-full animate-pulse" />
                      <span className="text-xs font-semibold opacity-70 uppercase tracking-wider">Active Travel Assistant</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[#0A0A0B]/10 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user" 
                      ? "bg-[#C9A84C] text-[#0A0A0B] font-medium rounded-tr-none" 
                      : "bg-[#1A1A1E] text-[#F5F0E8] border border-white/5 rounded-tl-none"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1E] p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Predefined Questions */}
            <div className="px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {predefinedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q.text)}
                  className="whitespace-nowrap bg-[#1A1A1E] border border-white/5 px-4 py-2 rounded-xl text-xs text-[#9A9A9A] hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all"
                >
                  {q.icon} {q.text}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 pt-2">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-[#1A1A1E] border border-white/5 rounded-2xl py-4 pl-5 pr-12 text-sm text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C]/50 transition-all"
                />
                <button 
                  onClick={() => handleSendMessage()}
                  className="absolute right-2 p-2 bg-[#C9A84C] text-[#0A0A0B] rounded-xl hover:scale-105 transition-transform"
                >
                  <Send size={18} />
                </button>
              </div>
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] text-[#9A9A9A] hover:text-[#C9A84C] transition-colors"
              >
                <ExternalLink size={12} />
                Open full Assistant on WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-br from-[#C9A84C] to-[#D4B86A] rounded-2xl shadow-2xl flex items-center justify-center relative group"
      >
        <Bot size={28} className="text-[#0A0A0B]" />
        {!isOpen && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#0A0A0B]" />}
      </motion.button>
    </div>
  );
}
