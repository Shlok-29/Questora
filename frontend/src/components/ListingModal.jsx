import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Loader2,
  Home,
  Wifi,
  Coffee,
  Wind,
  Car,
  Users,
  Bed,
  Bath,
  MapPin,
  LocateFixed,
  ImagePlus,
} from "lucide-react";

import axios from "axios";
import { toast } from "react-hot-toast";

const AMENITIES = [
  { id: "wifi", label: "Free WiFi", icon: <Wifi size={16} /> },
  { id: "ac", label: "Air Conditioning", icon: <Wind size={16} /> },
  { id: "kitchen", label: "Kitchen", icon: <Coffee size={16} /> },
  { id: "parking", label: "Parking Area", icon: <Car size={16} /> },
];

export default function ListingModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    price: "",
    category: "Homestay",
    contact: "",
    ownerName: "",
    maxGuests: "",
    bedrooms: "",
    bathrooms: "",
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number" && Number(value) < 0) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilityToggle = (id) => {
    setFacilities((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages(files);
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            location: data.display_name || "",
            city: data.address.city || data.address.town || data.address.village || "",
            district: data.address.state_district || "",
            state: data.address.state || "",
            pincode: data.address.postcode || "",
          }));
          toast.success("Location detected!");
        } catch (err) {
          toast.error("Failed to fetch address details");
        }
      },
      () => toast.error("Location permission denied")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const phoneDigits = formData.contact.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      toast.error("Contact number must be at least 10 digits");
      return;
    }

    const requiredFields = ["title", "description", "location", "city", "state", "price", "contact", "ownerName"];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }

    setLoading(true);
    const data = new FormData();
    
    // Normalize Data for Backend
    const uploadData = { ...formData };
    if (uploadData.category === "Homestay") uploadData.category = "Stay";

    Object.keys(uploadData).forEach((key) => {
      data.append(key, uploadData[key]);
    });

    data.append("facilities", JSON.stringify(facilities));
    images.forEach((image) => data.append("images", image));

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      // Note: Do not set Content-Type header manually when sending FormData. 
      // Axios/Browser will set it automatically with the correct boundary.
      await axios.post(`${apiUrl}/listings`, data);

      setSuccess(true);
      toast.success("Property listed successfully!");
      setTimeout(() => {
        onClose();
        setSuccess(false);
        resetForm();
      }, 2500);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to list property");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "", description: "", location: "", city: "", district: "", state: "", pincode: "",
      latitude: "", longitude: "", price: "", category: "Homestay", contact: "", ownerName: "",
      maxGuests: "", bedrooms: "", bathrooms: "",
    });
    setFacilities([]);
    setImages([]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-[#050816] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#050816]/90 backdrop-blur-2xl border-b border-white/10 px-8 py-7 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Home size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[#f3eee8]">Host Your Property</h2>
              <p className="text-white/35 text-xs uppercase tracking-[0.25em] mt-1">Join The Questora Network</p>
            </div>
          </div>
          <button onClick={onClose} className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {success ? (
            <div className="py-28 flex flex-col items-center justify-center text-center">
              <div className="w-28 h-28 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 animate-bounce">
                <CheckCircle size={58} className="text-green-400" />
              </div>
              <h3 className="text-4xl font-black text-white mb-4">Property Published!</h3>
              <p className="text-white/40 text-lg max-w-md">Your homestay is now visible to weekend travelers.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-orange-400 text-sm uppercase tracking-[0.25em] font-bold">01. Property Information</h3>
                <input required name="title" value={formData.title} onChange={handleInputChange} placeholder="Property Name" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Full Address</label>
                    <button type="button" onClick={detectLocation} className="flex items-center gap-2 px-3 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-orange-500/20 transition-all">
                      <LocateFixed size={12} /> Use Current Location
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" />
                    <input required name="location" value={formData.location} onChange={handleInputChange} placeholder="Full Property Address" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all" />
                  <input required name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all" />
                </div>
                <textarea required rows={4} name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your property (vibes, views, unique features)..." className="w-full resize-none bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all" />
                <input required type="number" min="0" name="price" value={formData.price} onChange={handleInputChange} placeholder="Weekend Price in ₹" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all" />
              </div>

              <div className="space-y-6">
                <h3 className="text-orange-400 text-sm uppercase tracking-[0.25em] font-bold">02. Capacity & Amenities</h3>
                <div className="grid grid-cols-3 gap-4">
                  <input type="number" min="0" name="maxGuests" value={formData.maxGuests} onChange={handleInputChange} placeholder="Guests" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-center text-white placeholder:text-white/30" />
                  <input type="number" min="0" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} placeholder="Beds" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-center text-white placeholder:text-white/30" />
                  <input type="number" min="0" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} placeholder="Baths" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-center text-white placeholder:text-white/30" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AMENITIES.map((amenity) => (
                    <button key={amenity.id} type="button" onClick={() => handleFacilityToggle(amenity.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${facilities.includes(amenity.id) ? "bg-orange-500/10 border-orange-500/50 text-orange-300" : "bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/5"}`}>
                      {amenity.icon} <span className="text-xs font-semibold">{amenity.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-orange-400 text-sm uppercase tracking-[0.25em] font-bold">03. Property Photos</h3>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="property-images" />
                <label htmlFor="property-images" className="flex flex-col items-center justify-center min-h-[200px] rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-orange-500/30 cursor-pointer transition-all p-6">
                  <ImagePlus size={38} className="text-orange-400 mb-4" />
                  <h4 className="text-xl font-bold text-[#f3eee8] mb-2">Upload Photos</h4>
                  <p className="text-white/35 text-sm text-center">Add up to 5 photos (Optional)</p>
                </label>
                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-4">
                    {images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-xl border border-white/10 overflow-hidden">
                        <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-orange-400 text-sm uppercase tracking-[0.25em] font-bold">04. Host Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder="Owner Full Name" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all" />
                  <input required name="contact" value={formData.contact} onChange={handleInputChange} placeholder="WhatsApp Number" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-lg shadow-[0_10px_40px_rgba(249,115,22,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {loading ? <><Loader2 className="animate-spin" size={24} /> Publishing...</> : "Publish Property"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}