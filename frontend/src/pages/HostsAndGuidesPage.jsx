import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { 
  Home, 
  Compass, 
  MapPin, 
  Phone, 
  Plus, 
  X, 
  CheckCircle, 
  Loader2, 
  Wifi, 
  Coffee, 
  Wind, 
  Car, 
  Users, 
  Bed, 
  Bath, 
  Award, 
  Languages, 
  ShieldCheck, 
  Sparkles, 
  LocateFixed, 
  ImagePlus, 
  Search, 
  Briefcase 
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";

// Initial Curated Showcase Data for Homestays & Guides
const INITIAL_HOMESTAYS = [
  {
    _id: "hs-1",
    title: "Old Manali Heritage Wooden Cottage",
    category: "Homestay",
    ownerName: "Tenzin Norbu",
    city: "Manali",
    state: "Himachal Pradesh",
    location: "Old Manali Village, near Manu Temple",
    price: 2400,
    description: "Traditional Himachali wooden home with panoramic snow-capped mountain views, home-cooked organic meals, and cozy fireplace lounge.",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    facilities: ["wifi", "kitchen", "parking"],
    contact: "9816012345",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    _id: "hs-2",
    title: "Coorg Coffee Estate Bungalow",
    category: "Homestay",
    ownerName: "Ananya & Rohan Muthappa",
    city: "Madikeri",
    state: "Karnataka",
    location: "Kutta Estate Road, Coorg",
    price: 3800,
    description: "Nestled inside a 50-acre lush coffee plantation. Enjoy fresh estate coffee, bonfire evenings, and guided plantation trails.",
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    facilities: ["wifi", "kitchen", "parking", "ac"],
    contact: "9448098765",
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    _id: "hs-3",
    title: "Jaipur Heritage Haveli Homestay",
    category: "Homestay",
    ownerName: "Thakur Vikram Singh",
    city: "Jaipur",
    state: "Rajasthan",
    location: "Bani Park, Pink City, Jaipur",
    price: 3100,
    description: "Authentic 120-year-old Rajasthani haveli with fresco courtyard, royal thali breakfast, and rooftop view of Nahargarh Fort.",
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2,
    facilities: ["wifi", "ac", "parking"],
    contact: "9829011223",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

const INITIAL_GUIDES = [
  {
    _id: "lg-1",
    title: "Varanasi Spiritual & Ghat Heritage Walking Guide",
    category: "LocalGuide",
    ownerName: "Acharya Rajesh Sharma",
    city: "Varanasi",
    state: "Uttar Pradesh",
    location: "Dashashwamedh Ghat & Old Gullies",
    price: 1200,
    specialization: "Heritage & Culture",
    languagesSpoken: ["Hindi", "English", "Sanskrit"],
    yearsOfExperience: 8,
    description: "Born and raised in Kashi. I decode hidden secrets of ancient alleys, Ganga Aarti rituals, and 3000-year-old temples.",
    contact: "9839055443",
    images: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    _id: "lg-2",
    title: "High Altitude Himalayan Trekker & Nature Specialist",
    category: "LocalGuide",
    ownerName: "Stanzin Dorje",
    city: "Leh",
    state: "Ladakh",
    location: "Markha Valley & Pangong Region",
    price: 2500,
    specialization: "Trekking & Outdoors",
    languagesSpoken: ["Ladakhi", "Hindi", "English"],
    yearsOfExperience: 11,
    description: "Certified wilderness mountaineer. Specialized in off-the-grid treks, monastery architecture, and wildlife spotting (Snow Leopard & ibex).",
    contact: "9419188776",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  {
    _id: "lg-3",
    title: "Old Delhi Culinary Trail & Street Food Historian",
    category: "LocalGuide",
    ownerName: "Imran Khan",
    city: "New Delhi",
    state: "Delhi",
    location: "Chandni Chowk & Jama Masjid",
    price: 1500,
    specialization: "Food & Culinary Walks",
    languagesSpoken: ["Hindi", "Urdu", "English"],
    yearsOfExperience: 6,
    description: "Explore 100-year-old legendary food stalls, secret spice markets, Mughlai recipes, and historical bazaars of Purani Dilli.",
    contact: "9811099887",
    images: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80"
    ]
  }
];

const AMENITIES = [
  { id: "wifi", label: "Free WiFi", icon: <Wifi size={16} /> },
  { id: "ac", label: "Air Conditioning", icon: <Wind size={16} /> },
  { id: "kitchen", label: "Home Kitchen", icon: <Coffee size={16} /> },
  { id: "parking", label: "Parking Space", icon: <Car size={16} /> },
];

const GUIDE_SPECIALIZATIONS = [
  "Heritage & Culture",
  "Trekking & Outdoors",
  "Food & Culinary Walks",
  "Photography & Wildlife",
  "Local Living & Markets"
];

export default function HostsAndGuidesPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'homestays', 'guides'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  // Dynamic Data state
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Registration Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partnerType, setPartnerType] = useState("homestay"); // 'homestay' | 'guide'
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [formImages, setFormImages] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    state: "",
    price: "",
    ownerName: "",
    contact: "",
    maxGuests: "4",
    bedrooms: "2",
    bathrooms: "2",
    specialization: "Heritage & Culture",
    languagesSpoken: "English, Hindi",
    yearsOfExperience: "5",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    fetchListings();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/listings`);
      if (res.data && res.data.length > 0) {
        setListings(res.data);
      } else {
        setListings([...INITIAL_HOMESTAYS, ...INITIAL_GUIDES]);
      }
    } catch (err) {
      console.warn("Could not fetch remote listings, displaying initial curated dataset.");
      setListings([...INITIAL_HOMESTAYS, ...INITIAL_GUIDES]);
    } finally {
      setLoading(false);
    }
  };

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
    setFormImages(files);
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
            location: data.display_name || "",
            city: data.address.city || data.address.town || data.address.village || "",
            state: data.address.state || "",
          }));
          toast.success("Location detected!");
        } catch (err) {
          toast.error("Failed to fetch location address");
        }
      },
      () => toast.error("Location permission denied")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contact.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return;
    }

    if (!formData.title || !formData.city || !formData.price || !formData.ownerName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    
    const isGuide = partnerType === "guide";
    data.append("title", formData.title);
    data.append("description", formData.description || (isGuide ? `Verified local guide in ${formData.city}` : `Beautiful homestay in ${formData.city}`));
    data.append("location", formData.location || `${formData.city}, ${formData.state}`);
    data.append("city", formData.city);
    data.append("state", formData.state || "India");
    data.append("price", formData.price);
    data.append("ownerName", formData.ownerName);
    data.append("contact", formData.contact);
    data.append("category", isGuide ? "LocalGuide" : "Homestay");

    if (isGuide) {
      data.append("specialization", formData.specialization);
      data.append("yearsOfExperience", formData.yearsOfExperience);
      const langs = formData.languagesSpoken.split(",").map((s) => s.trim()).filter(Boolean);
      data.append("languagesSpoken", JSON.stringify(langs));
    } else {
      data.append("maxGuests", formData.maxGuests);
      data.append("bedrooms", formData.bedrooms);
      data.append("bathrooms", formData.bathrooms);
      data.append("facilities", JSON.stringify(facilities));
    }

    formImages.forEach((img) => data.append("images", img));

    try {
      const res = await axios.post(`${API_BASE_URL}/listings`, data);
      
      const newListing = res.data._id ? res.data : {
        _id: `partner-${Date.now()}`,
        ...formData,
        category: isGuide ? "LocalGuide" : "Homestay",
        languagesSpoken: formData.languagesSpoken.split(",").map(s => s.trim()),
        images: formImages.length > 0 ? [URL.createObjectURL(formImages[0])] : [
          isGuide 
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
            : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
        ]
      };

      setListings((prev) => [newListing, ...prev]);
      setSubmitSuccess(true);
      toast.success(isGuide ? "Registered as a Local Guide!" : "Homestay listed successfully!");
      
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        resetForm();
      }, 2000);
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback local insertion if server unavailable
      const newListing = {
        _id: `partner-${Date.now()}`,
        ...formData,
        category: isGuide ? "LocalGuide" : "Homestay",
        languagesSpoken: formData.languagesSpoken.split(",").map(s => s.trim()),
        images: formImages.length > 0 ? [URL.createObjectURL(formImages[0])] : [
          isGuide 
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
            : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
        ]
      };
      setListings((prev) => [newListing, ...prev]);
      setSubmitSuccess(true);
      toast.success("Registration completed!");
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        resetForm();
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      city: "",
      state: "",
      price: "",
      ownerName: "",
      contact: "",
      maxGuests: "4",
      bedrooms: "2",
      bathrooms: "2",
      specialization: "Heritage & Culture",
      languagesSpoken: "English, Hindi",
      yearsOfExperience: "5",
    });
    setFacilities([]);
    setFormImages([]);
  };

  // Filter listings based on tab, search query, and specialization
  const filteredListings = listings.filter((item) => {
    // Tab filter
    if (activeTab === "homestays" && item.category !== "Homestay" && item.category !== "Stay") return false;
    if (activeTab === "guides" && item.category !== "LocalGuide") return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCity = item.city?.toLowerCase().includes(q);
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchOwner = item.ownerName?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      if (!matchCity && !matchTitle && !matchOwner && !matchLoc) return false;
    }

    // Specialization filter (for guides)
    if (activeTab === "guides" && selectedSpecialization !== "All") {
      if (item.specialization !== selectedSpecialization) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#050814] text-[#F5F0E8] font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar scrolled={scrolled} />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden px-6">
        {/* Ambient Glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-orange-600/20 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl mb-6">
            <Sparkles size={16} className="text-orange-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-orange-300">
              Community Hosts & Local Experts
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Authentic Homestays & <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Verified Local Guides</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Discover cozy family-run homestays and connect with knowledgeable local guides to experience destinations like a true insider.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setPartnerType("homestay");
              }}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_10px_35px_rgba(249,115,22,0.35)] hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Register Your Homestay / Guide</span>
            </button>

            <a
              href="#explore"
              className="px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/[0.1] backdrop-blur-xl transition-all duration-300"
            >
              Explore Network
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section id="explore" className="relative max-w-7xl mx-auto px-6 pb-28">
        {/* Controls Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          {/* Tab Selection */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === "all"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              All Partners ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab("homestays")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === "homestays"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Home size={14} /> Homestays
            </button>
            <button
              onClick={() => setActiveTab("guides")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === "guides"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Award size={14} /> Local Guides
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="Search by city, title, or host name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
            />
          </div>
        </div>

        {/* Guide Specialization Filter Pill Bar (Visible when Local Guides tab selected or activeTab === 'guides') */}
        {activeTab === "guides" && (
          <div className="flex flex-wrap items-center gap-3 pt-6">
            <span className="text-xs uppercase tracking-widest text-white/40 font-semibold mr-2">Specialization:</span>
            {["All", ...GUIDE_SPECIALIZATIONS].map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedSpecialization === spec
                    ? "bg-amber-400/20 border-amber-400 text-amber-300"
                    : "bg-white/[0.03] border-white/10 text-white/50 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        )}

        {/* Display Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 size={36} className="animate-spin text-orange-400 mb-4" />
            <p className="text-white/40 text-sm font-medium">Loading local community hosts...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Compass size={32} className="text-white/30" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No listings found</h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              Try adjusting your search criteria or register as a host/guide in this city!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
            {filteredListings.map((item) => {
              const isGuide = item.category === "LocalGuide";
              return (
                <div
                  key={item._id || item.title}
                  className="group relative bg-[#090D21] border border-white/10 rounded-[2rem] overflow-hidden hover:border-orange-500/40 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex flex-col"
                >
                  {/* Card Image Header */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : isGuide
                          ? "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80"
                          : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090D21] via-transparent to-black/30" />

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-lg backdrop-blur-xl border ${
                          isGuide
                            ? "bg-amber-500/20 border-amber-400/40 text-amber-300"
                            : "bg-orange-500/20 border-orange-400/40 text-orange-300"
                        }`}
                      >
                        {isGuide ? <Award size={12} /> : <Home size={12} />}
                        {isGuide ? "Local Guide" : "Homestay"}
                      </span>
                    </div>

                    {/* Verified Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-xl text-emerald-300 text-[10px] font-bold tracking-wider">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location Badge */}
                      <div className="flex items-center gap-2 text-white/50 text-xs font-medium mb-2">
                        <MapPin size={14} className="text-orange-400 shrink-0" />
                        <span>{item.location || `${item.city}, ${item.state}`}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>

                      {/* Guide specific metadata */}
                      {isGuide ? (
                        <div className="mt-3 space-y-2">
                          {item.specialization && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-amber-200 font-medium">
                              <Briefcase size={12} className="text-amber-400" />
                              {item.specialization}
                            </div>
                          )}
                          {item.languagesSpoken && item.languagesSpoken.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-white/60">
                              <Languages size={14} className="text-orange-400 shrink-0" />
                              <span>Speaks: {Array.isArray(item.languagesSpoken) ? item.languagesSpoken.join(", ") : item.languagesSpoken}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Homestay Capacity & Facilities */
                        <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                          {item.maxGuests && (
                            <span className="flex items-center gap-1">
                              <Users size={14} className="text-orange-400" /> {item.maxGuests} Guests
                            </span>
                          )}
                          {item.bedrooms && (
                            <span className="flex items-center gap-1">
                              <Bed size={14} className="text-orange-400" /> {item.bedrooms} Beds
                            </span>
                          )}
                          {item.bathrooms && (
                            <span className="flex items-center gap-1">
                              <Bath size={14} className="text-orange-400" /> {item.bathrooms} Baths
                            </span>
                          )}
                        </div>
                      )}

                      <p className="mt-4 text-xs text-white/50 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                          {isGuide ? "Guide Fee" : "Nightly Stay"}
                        </span>
                        <span className="text-xl font-black text-white">
                          ₹{item.price}{" "}
                          <span className="text-xs font-normal text-white/50">
                            /{isGuide ? "day" : "night"}
                          </span>
                        </span>
                      </div>

                      {/* WhatsApp Inquiry Button */}
                      <a
                        href={`https://wa.me/91${item.contact.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(
                          item.ownerName || "Host"
                        )},%20I%20saw%20your%20${isGuide ? "Guide%20Profile" : "Homestay"}%20on%20Questora%20and%20would%20like%20to%20inquire.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs hover:bg-emerald-500/20 transition-all"
                      >
                        <Phone size={14} /> Contact Host
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Partner Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-4xl bg-[#050816] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-[#050816]/95 backdrop-blur-2xl border-b border-white/10 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  {partnerType === "guide" ? (
                    <Award size={22} className="text-white" />
                  ) : (
                    <Home size={22} className="text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#f3eee8]">
                    Join as {partnerType === "guide" ? "Local Guide" : "Homestay Host"}
                  </h2>
                  <p className="text-white/40 text-xs uppercase tracking-[0.2em]">
                    Connect with travelers in your city
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {submitSuccess ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle size={48} className="text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    Registration Successful!
                  </h3>
                  <p className="text-white/40 text-sm max-w-md">
                    Your profile is now live on the Questora Community network.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Type Selector Tabs */}
                  <div className="flex items-center gap-3 p-1 bg-white/[0.03] border border-white/10 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setPartnerType("homestay")}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        partnerType === "homestay"
                          ? "bg-orange-500 text-white shadow-lg"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Home size={16} /> List Homestay
                    </button>

                    <button
                      type="button"
                      onClick={() => setPartnerType("guide")}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        partnerType === "guide"
                          ? "bg-amber-400 text-slate-950 shadow-lg font-black"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Award size={16} /> Become Local Guide
                    </button>
                  </div>

                  {/* Dynamic Form Sections */}
                  {partnerType === "homestay" ? (
                    /* HOMESTAY FORM */
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-orange-400 text-xs uppercase tracking-[0.25em] font-extrabold">
                          01. Homestay Details
                        </h3>
                        <input
                          required
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Homestay Name (e.g. Pine View Heritage Villa)"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            required
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City / Destination"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                          />
                          <input
                            required
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                          />
                        </div>

                        <div className="relative">
                          <input
                            required
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Full Address / Locality Landmark"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-5 pr-36 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                          />
                          <button
                            type="button"
                            onClick={detectLocation}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] font-bold uppercase tracking-wider hover:bg-orange-500/20 transition-all"
                          >
                            <LocateFixed size={12} /> Auto Detect
                          </button>
                        </div>

                        <textarea
                          required
                          rows={3}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe the homestay experience, mountain views, authentic home cooked food, vibes..."
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all text-sm resize-none"
                        />

                        <input
                          required
                          type="number"
                          min="0"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="Price per Night (₹)"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                        />
                      </div>

                      {/* Amenities & Capacity */}
                      <div className="space-y-4">
                        <h3 className="text-orange-400 text-xs uppercase tracking-[0.25em] font-extrabold">
                          02. Capacity & Amenities
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="number"
                            name="maxGuests"
                            value={formData.maxGuests}
                            onChange={handleInputChange}
                            placeholder="Max Guests"
                            className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-sm"
                          />
                          <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleInputChange}
                            placeholder="Bedrooms"
                            className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-sm"
                          />
                          <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleInputChange}
                            placeholder="Bathrooms"
                            className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-center text-white text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {AMENITIES.map((amenity) => (
                            <button
                              key={amenity.id}
                              type="button"
                              onClick={() => handleFacilityToggle(amenity.id)}
                              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold transition-all ${
                                facilities.includes(amenity.id)
                                  ? "bg-orange-500/10 border-orange-500/50 text-orange-300"
                                  : "bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/5"
                              }`}
                            >
                              {amenity.icon} {amenity.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* LOCAL GUIDE FORM */
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-amber-400 text-xs uppercase tracking-[0.25em] font-extrabold">
                          01. Guide Profile Details
                        </h3>
                        <input
                          required
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Guide Title (e.g. Old City Heritage & Street Food Guide)"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            required
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City of Expertise (e.g. Varanasi, Leh)"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                          />
                          <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className="w-full bg-[#050816] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                          >
                            {GUIDE_SPECIALIZATIONS.map((spec) => (
                              <option key={spec} value={spec} className="bg-[#050816]">
                                {spec}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            name="languagesSpoken"
                            value={formData.languagesSpoken}
                            onChange={handleInputChange}
                            placeholder="Languages Spoken (comma separated: English, Hindi, German)"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                          />
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            placeholder="Years of Guiding Experience"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                          />
                        </div>

                        <textarea
                          required
                          rows={3}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Brief bio & expertise (e.g. Certified mountaineer, 8 years taking travelers through ancient ghats and secret street food spots)..."
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all text-sm resize-none"
                        />

                        <input
                          required
                          type="number"
                          min="0"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="Daily Guide Fee in ₹ (e.g. 1500)"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Common Contact & Photo Section */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-orange-400 text-xs uppercase tracking-[0.25em] font-extrabold">
                      {partnerType === "guide" ? "02. Contact & Photos" : "03. Host Details & Photos"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        required
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        placeholder={partnerType === "guide" ? "Your Full Name" : "Owner / Host Name"}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                      />
                      <input
                        required
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="WhatsApp Contact Number (10 digits)"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="partner-images"
                      />
                      <label
                        htmlFor="partner-images"
                        className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all"
                      >
                        <ImagePlus size={32} className="text-orange-400 mb-2" />
                        <span className="text-sm font-bold text-white">
                          Upload Photos (Optional)
                        </span>
                        <span className="text-xs text-white/40">
                          {partnerType === "guide"
                            ? "Add profile photo or tour memories"
                            : "Add property photos"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
                      partnerType === "guide"
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-amber-400/20 hover:scale-[1.01]"
                        : "bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-orange-500/20 hover:scale-[1.01]"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} /> Registering...
                      </>
                    ) : (
                      `Submit ${partnerType === "guide" ? "Guide Profile" : "Homestay Listing"}`
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
