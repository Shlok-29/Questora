# Questora — Escape Beyond
> A next-generation MERN-stack weekend-first travel ecosystem connecting travelers with authentic homestays, verified local guides, self-drive rentals, and AI-powered trip planning.

---

## 📌 Brief Description

**Questora** transforms traditional travel booking by delivering a seamless, weekend-focused marketplace designed for spontaneous getaway planning. Built to eliminate heavy intermediate commission fees, Questora directly connects travelers with local community homestays, certified city guides, and self-drive vehicles. Featuring an AI-powered itinerary engine, real-time destination crowd indicators, and automated WhatsApp trip assistance, Questora provides an effortless end-to-end travel experience.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18
- **Styling**: Tailwind CSS, Vanilla CSS Design System, Custom Glassmorphism Token Architecture
- **State Management**: Zustand
- **Data Fetching & Caching**: TanStack React Query (v5)
- **Routing**: React Router DOM (v6)
- **Icons & Animations**: Lucide React, Framer Motion
- **UI Notifications**: React Hot Toast

### **Backend**
- **Runtime**: Node.js (v24+)
- **Framework**: Express.js (v5)
- **Database ORM**: Mongoose (v9)
- **File Uploads**: Multer & Multer Storage Cloudinary
- **Authentication & Security**: CORS, Dotenv, Twilio OTP Verification
- **Payments**: Razorpay Node.js SDK

### **Database & Infrastructure**
- **Database**: MongoDB Atlas (Cloud) / Local MongoDB
- **Cloud Media Storage**: Cloudinary CDN
- **AI Engine**: Google Gemini API & MiniMax AI Integration
- **Server Deployment**: Vercel Ready / Node Server Environment

---

## 📁 Folder Structure

```text
Questora/
├── backend/                        ← Node.js & Express API Backend
│   ├── config/                     ← Cloudinary & External Service Configurations
│   │   └── cloudinary.js           
│   ├── models/                     ← Mongoose Schemas & Database Models
│   │   ├── Booking.js              ← Booking Data Schema
│   │   ├── Listing.js              ← Unified Listings (Homestays, Guides, Stays)
│   │   └── User.js                 ← User Profiles & OTP State
│   ├── routes/                     ← Express REST API Endpoints
│   │   ├── authRoutes.js           ← Phone & OTP Verification Routes
│   │   └── listingRoutes.js        ← Listings CRUD & Multipart Upload Routes
│   ├── .env.example                ← Environment Variable Template (No Secrets)
│   ├── bookings.json               ← Fallback Local Booking Log
│   ├── package.json                ← Backend Dependencies
│   ├── server.js                   ← Express Application Entry Point
│   └── vercel.json                 ← Vercel Deployment Settings
│
├── frontend/                       ← React Single Page Application
│   ├── public/                     ← Static Web Assets
│   │   ├── favicon.png             ← Modern Questora Monogram Logo Asset
│   │   └── index.html              ← HTML5 Entry Point & Meta Tags
│   ├── src/                        ← React Source Code
│   │   ├── components/             ← Reusable UI Components
│   │   │   ├── CarouselHero.jsx    ← Interactive Hero Carousel Component
│   │   │   ├── ListingModal.jsx    ← Property Onboarding Modal Form
│   │   │   ├── Navbar.jsx          ← Glassmorphic Floating Header
│   │   │   └── WhatsAppAI.jsx      ← WhatsApp AI Assistant Floating Trigger
│   │   ├── data/                   ← Mock Data & Static Catalogues
│   │   ├── lib/                    ← Axios API Client Instance
│   │   ├── pages/                  ← Application Views & Routes
│   │   │   ├── BookingPage.jsx     ← Checkout & Reservation Confirmation
│   │   │   ├── HostsAndGuidesPage.jsx ← Dedicated Homestays & Local Guides Page
│   │   │   ├── ItineraryPage.jsx   ← Dynamic AI Itinerary Showcase
│   │   │   ├── LandingPage.jsx     ← Hero Showcase & Destination Grid
│   │   │   ├── LoginPage.jsx       ← OTP Authentication Page
│   │   │   ├── PlanPage.jsx        ← AI Trip Planner Form
│   │   │   └── RentalsPage.jsx     ← Self-Drive Vehicles Marketplace
│   │   ├── store/                  ← Zustand Global Application State
│   │   │   └── tripStore.js        
│   │   ├── App.js                  ← App Router & Layout Shell
│   │   ├── index.css               ← Global CSS Utilities & Keyframe Animations
│   │   └── index.js                ← React Root Mount Point
│   ├── postcss.config.js           ← PostCSS Settings
│   ├── tailwind.config.js          ← Tailwind Theme Customizations
│   └── vercel.json                 ← Frontend Vercel SPA Configuration
│
├── whatsapp-assistant/             ← Autonomous WhatsApp AI Assistant Service
│   ├── controllers/                ← Webhook & Travel Bot Handlers
│   ├── models/                     ← Assistant Database Schemas
│   ├── routes/                     ← Webhook Routes
│   ├── services/                   ← AI, Twilio, & Distance Matrix Services
│   ├── package.json                ← Assistant Service Dependencies
│   └── server.js                   ← Autonomous Bot Server
│
├── .gitignore                      ← Monorepo Git Ignore Rules
├── package.json                    ← Root Monorepo Orchestration Scripts
└── README.md                       ← Comprehensive Project Documentation
```

---

## ✨ Detailed Description of Complete Project Features

### 1. Dedicated Homestays & Local Guides Portal (`/hosts-and-guides`)
- **Community Host Marketplace**: Explore handpicked local homestays with nightly pricing, guest capacity, bedroom count, and amenities (*Free WiFi, AC, Home Kitchen, Parking*).
- **Verified Local City Guides**: Discover certified local guides categorized by expertise (*Heritage & Culture, Trekking & Outdoors, Culinary Walks, Photography, Local Living*), spoken languages, experience, and daily/hourly rates.
- **Dual Partner Onboarding Form**: Interactive onboarding modal allowing hosts to list their properties and local guides to register their service in any city with GPS location auto-detection.

### 2. AI-Powered Trip Planner & Dynamic Itinerary Engine (`/plan`, `/itinerary/:destination`)
- **Personalized Itineraries**: Custom day-by-day travel plans tailored to travel dates, budget preference, travel style, and group size.
- **Real-Time Crowd & Demand Predictor**: Visual indicators (*Quiet, Moderate, Peak*) informing travelers about expected crowdedness at popular destinations.
- **Interactive Trip Breakdown**: Detailed breakdowns of daily activities, recommended stays, food spots, and estimated travel budgets.

### 3. Self-Drive Vehicle Rentals (`/rentals`)
- **Diverse Mobility Fleet**: Browse self-drive SUVs, sedans, motorcycles, and scooters for weekend road trips.
- **Filtering Options**: Filter vehicles by city, transmission type (Manual/Automatic), fuel type, and price range.

### 4. Direct Zero-Commission Communication
- **WhatsApp Direct Connect**: Instant "Contact Host / Guide" action buttons linking travelers directly to host WhatsApp numbers, bypassing platform commission cuts.

### 5. Secure Payments & Flexible Authentication (`/booking`, `/login`)
- **Razorpay Payment Gateway**: Seamless payment order creation for confirmed bookings.
- **Twilio Phone OTP Authentication**: Verification via SMS OTP with development fallback mode.

---

## 🏗️ Structured Use of Tech Stack

| Layer | Technology | Purpose & Architectural Function |
| :--- | :--- | :--- |
| **Frontend UI** | **React 18 & Tailwind CSS** | Component-driven declarative UI with modern dark glassmorphism, responsive grid layouts, and micro-interactions. |
| **State Management** | **Zustand** | Lightweight global state store managing trip preferences, booking items, and payment verification status across routes. |
| **Data Fetching** | **TanStack React Query** | Asynchronous data fetching, background refetching, and state caching for optimized API performance. |
| **Backend API** | **Node.js & Express 5** | RESTful routing, multipart FormData processing, payment order endpoints, and error handling. |
| **Database** | **MongoDB & Mongoose 9** | Flexible document storage for property listings, local guide profiles, user accounts, and booking transactions. |
| **Media Pipeline** | **Cloudinary CDN** | Automatic image upload, resizing, transformation, and fast global CDN delivery for property and profile images. |
| **Integrations** | **Razorpay & Twilio** | Secure payment processing and automated SMS/WhatsApp verification notifications. |

---

## 📈 Benefits, Scalability, and Revenue Model

### **User & Host Benefits**
- **Zero Commission Cuts**: Direct contact model saves up to 15-20% compared to traditional Online Travel Agencies (OTAs).
- **Hyper-Local Authenticity**: Connects travelers directly with certified local guides and home-cooked culinary experiences.
- **Frictionless Onboarding**: Hosts and guides can publish their services in under 3 minutes with automated GPS address lookup.

### **Scalability Architecture**
- **Decoupled Monorepo Design**: Independent scaling of frontend SPA, backend API endpoints, and autonomous WhatsApp assistant microservices.
- **Cloud-Native Infrastructure**: MongoDB Atlas dynamic auto-scaling paired with Cloudinary CDN media distribution handles heavy weekend traffic spikes seamlessly.

### **Revenue Model**
1. **Featured Host & Guide Subscriptions**: Premium placement badges for top-tier homestays and verified local guides on city search pages.
2. **Verified Partner Badging**: Annual verification fee for local guides providing credential checks and trust badges.
3. **B2B Fleet Partnership Models**: Commission-free lead generation subscription tier for commercial vehicle rental operators.
4. **AI Assistant Upgrades**: Premium WhatsApp AI concierge subscriptions for travelers seeking 24/7 hyper-personalized recommendations.

---

## 🌟 Key Advantages

- **Weekend-First Focus**: Tailored specifically for 2-day to 3-day getaways, filling a crucial niche overlooked by general travel platforms.
- **Direct WhatsApp Communication**: Removes registration friction for travelers and builds trust through direct messaging.
- **Unified Ecosystem**: Single platform integrating Stays, Guides, Vehicle Rentals, and AI Planning in one place.
- **Modern Luxury Aesthetics**: High-contrast dark glassmorphism design that wows users at first glance.
