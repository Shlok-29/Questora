import React, { useState } from "react";
import { MessageCircle, X, Send, Bot, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTripStore from "../store/tripStore";
import { WHATSAPP_ASSISTANT_URL } from "../config";

export default function TravelAssistantIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { sessionId, tripName, destination } = useTripStore();

  const quickReplies = [
    "Weather in " + (destination?.name || "Manali"),
    "Food nearby",
    "Budget check",
    "Schedule"
  ];

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;

    const userMsg = msg;
    setMessage("");
    setResponses(prev => [...prev, { from: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // For demo, show AI response directly
      // In production, this would call the WhatsApp webhook
      setResponses(prev => [...prev, {
        from: 'ai',
        text: `🤖 Questora AI: Got your message "${userMsg}"! This feature will be fully connected once we set up ngrok/webhook. For now, your WhatsApp assistant is ready after payment!`
      }]);
    } catch (error) {
      setResponses(prev => [...prev, {
        from: 'ai',
        text: "Sorry, I'm having trouble connecting. Please use WhatsApp for assistance."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        style={{ boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)' }}
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <>
            <Bot size={28} className="mr-2" />
            <MessageCircle size={28} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
          </>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          style={{ maxHeight: '500px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold">Questora AI Assistant</h3>
                <p className="text-xs text-white/80">Your travel companion</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 overflow-y-auto" style={{ maxHeight: '280px' }}>
            {responses.length === 0 && (
              <div className="text-center text-slate-500 text-sm py-8">
                <Bot size={40} className="mx-auto mb-2 text-orange-300" />
                <p>Ask me about weather, food, budget, or your trip schedule!</p>
              </div>
            )}

            {responses.map((r, i) => (
              <div key={i} className={`mb-3 ${r.from === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-xl max-w-[85%] ${
                  r.from === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  <p className="text-sm">{r.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-center">
                <div className="inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => sendMessage(reply)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(message)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={() => sendMessage(message)}
              className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}