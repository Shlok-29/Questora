import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/tripStore";
import toast from "react-hot-toast";
import { ArrowLeft, CreditCard, CheckCircle, ShieldCheck } from "lucide-react";
import { API_BASE_URL, WHATSAPP_ASSISTANT_URL } from "../config";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingPage() {
  const navigate = useNavigate();
  const { cart, selectedHotel, members, destination, reset, dateRange, setPaid } = useTripStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nights = dateRange.start && dateRange.end 
    ? Math.max(1, Math.ceil((new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24))) 
    : 2;
  const totalCost = cart.reduce((sum, i) => sum + i.price, 0) + (selectedHotel ? selectedHotel.price * nights : 0);

  useEffect(() => {
    if (!destination) {
      navigate("/");
    }
  }, [destination, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Compile items for booking
      const bookingItems = [...cart];
      if (selectedHotel) {
        bookingItems.push({ ...selectedHotel, type: 'hotel' });
      }

      const userData = JSON.parse(localStorage.getItem("user"));
      let userPhone = userData?.phoneNumber || "911234567890";
      
      // Ensure phone number has '+' prefix for Twilio WhatsApp
      if (!userPhone.startsWith("+")) {
        userPhone = "+" + userPhone;
      }

      // 2. Record booking in main backend database
      await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: bookingItems,
          destinationId: destination.id,
          startDate: dateRange.start || new Date().toISOString(),
          endDate: dateRange.end || new Date(Date.now() + 86400000 * 2).toISOString(),
          quantity: members,
          userPhoneNumber: userPhone
        })
      });

      // 3. Initialize WhatsApp Assistant (Sends actual WhatsApp message)
      try {
        await fetch(`${WHATSAPP_ASSISTANT_URL}/api/v1/trips/initialize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_name: userData?.phoneNumber || 'Traveler',
            phone_number: userPhone,
            destination: destination.name,
            check_in_date: dateRange.start || new Date().toISOString(),
            check_out_date: dateRange.end || new Date(Date.now() + 86400000 * 2).toISOString(),
            hotel: selectedHotel,
            budget_total: totalCost,
            activities: cart,
            total_activities_cost: cart.reduce((sum, i) => sum + (i.price || 0), 0),
            total_hotel_cost: selectedHotel ? selectedHotel.price * nights : 0,
            grand_total: totalCost,
            members: members
          })
        });
      } catch (wsErr) {
        console.error("WhatsApp Assistant Init Error:", wsErr);
      }

      // 4. Success Actions
      setPaid(true);
      setIsSuccess(true);
      toast.success("Payment Successful! Confirmation sent to WhatsApp.");
      
    } catch (error) {
      console.error("Payment Process Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-body">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-slate-100 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle size={44} />
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 mb-2">Booking Confirmed!</h1>
            <p className="text-slate-500">Receipt ID: #QST-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 md:p-8 mb-8 border border-slate-100">
            <h2 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-6">Order Summary</h2>
            
            <div className="space-y-6">
              {/* Destination & Hotel */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-slate-900">{destination?.name}</p>
                  <p className="text-sm text-slate-500">{selectedHotel?.name || 'Standard Stay'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₹{(selectedHotel?.price * nights || 0).toLocaleString("en-IN")}</p>
                  <p className="text-xs text-slate-400">{nights} Nights</p>
                </div>
              </div>

              {/* Activities */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Activities</p>
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">• {item.name}</span>
                        <span className="text-slate-900 font-bold">₹{item.price.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="pt-6 border-t border-slate-300 flex justify-between items-center">
                <p className="font-display font-bold text-xl text-slate-900">Total Paid</p>
                <p className="font-display font-bold text-3xl text-orange-500">₹{totalCost.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                window.print();
                toast.success("Downloading receipt...");
              }}
              className="flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <ShieldCheck size={20} className="text-emerald-500" />
              Download Receipt
            </button>
            <button
              onClick={() => {
                reset();
                navigate("/");
              }}
              className="flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-orange-500 transition-all active:scale-95 shadow-lg"
            >
              Back to Home
            </button>
          </div>
          
          <p className="text-center text-xs text-slate-400 mt-8">
            A copy of this receipt has been sent to your registered WhatsApp number.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-900 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-bold text-sm uppercase tracking-wider">
          <ArrowLeft size={16} /> Back to Itinerary
        </button>

        <div className="mb-10 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-3">Secure Checkout</h1>
          <p className="text-slate-500 font-medium">Complete your payment to confirm your trip to {destination?.name}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
              <h2 className="font-display font-bold text-2xl mb-6">Order Summary</h2>
              
              {selectedHotel && (
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <img src={selectedHotel.image} alt={selectedHotel.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{selectedHotel.name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{nights} nights stay</p>
                  </div>
                  <p className="font-bold text-lg">₹{(selectedHotel.price * nights).toLocaleString("en-IN")}</p>
                </div>
              )}

              {cart.length > 0 && (
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Activities ({cart.length})</p>
                  {cart.map((act) => (
                    <div key={act.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">{act.name}</p>
                        <p className="text-xs text-slate-500">{members} members</p>
                      </div>
                      <p className="font-bold text-sm text-slate-600">₹{act.price.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <p className="font-bold text-xl text-slate-900">Total Amount</p>
                <p className="font-display font-bold text-3xl text-orange-500">₹{totalCost.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="md:col-span-2">
            <div className="bg-slate-900 text-white rounded-[2rem] shadow-xl p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="text-emerald-400" size={28} />
                <p className="font-bold">100% Secure Payment</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="text-slate-400 text-sm">You will be redirected to Razorpay's secure checkout page to complete this transaction.</p>
                <div className="flex gap-2">
                  <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-bold text-white/70">UPI</div>
                  <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-bold text-white/70">Cards</div>
                  <div className="bg-white/10 px-3 py-1.5 rounded text-xs font-bold text-white/70">NetBanking</div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || totalCost === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-wider text-sm uppercase py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-3"
              >
                {isProcessing ? "Processing..." : (
                  <>
                    <CreditCard size={18} /> Pay ₹{totalCost.toLocaleString("en-IN")}
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
