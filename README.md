# Questora — The Weekend-First Travel Marketplace

Welcome to the **Questora** repository! This project transforms the traditional hotel booking experience into a seamless, no-login marketplace dedicated to weekend getaways. It connects travelers directly with local hosts, vehicle rentals, and adventure guides without intermediate commissions.

## 🚀 Quick Start

This project is a monorepo built on the **MERN** stack (MongoDB, Express, React, Node.js). It is separated into two main directories: `frontend` and `backend`.

### 1. Backend Setup (Node.js & Express)

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Make sure you have a MongoDB instance running locally (or update the MONGO_URI in backend/.env)
# Start the backend server
npm run dev
```
*The backend server runs on `http://localhost:5000` by default.*

### 2. Frontend Setup (React & Vite/CRA)

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend application
npm start
```
*The React app should launch in your browser, running on `http://localhost:3000`.*

---

## 🏗️ Project Structure

```text
LAB-003-AI-AVENGERS/
├── backend/                  ← Node.js + Express backend
│   ├── .env                  ← Environment variables (PORT, MONGO_URI)
│   ├── package.json          ← Backend dependencies
│   └── server.js             ← Main application server & API routes
│
├── frontend/                 ← React application
│   ├── .env                  ← Frontend env vars (REACT_APP_API_URL)
│   ├── package.json          ← Frontend dependencies
│   ├── public/               ← Static assets
│   ├── src/                  ← React source code
│   │   ├── lib/              ← API hooks and mock data
│   │   ├── pages/            ← Page components (LandingPage, PlanPage, etc.)
│   │   ├── store/            ← Zustand global state
│   │   ├── App.js            ← Main Router
│   │   └── index.css         ← Tailwind CSS & custom styling
│   └── tailwind.config.js    ← Tailwind configuration
│
├── .gitignore                ← Root gitignore covering both projects
└── README.md                 ← This file
```

---

## ✨ Features

- **No-Login Friction:** Users can browse destinations and contact hosts instantly without the barrier of signing up.
- **Direct Contact Mockups:** Direct "WhatsApp" and "Call Owner" action flows emphasize zero-commission interactions.
- **Crowd Indicator System:** Real-time visual indicators (Green/Yellow/Red) alert users to the estimated crowdedness of popular weekend spots.
- **Categorized Marketplaces:** A 4-tab system dynamically filtering options into *Stay*, *Transport*, *Activities*, and *Food*.
- **Vibrant UI/UX:** A refreshed "Weekend-First" visual identity utilizing bright oranges, blues, and a modern clean aesthetic.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Tailwind CSS, Zustand (State Management), React Router, Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose).
- **Tooling**: dotenv, CORS, nodemon.

---

## 🤝 Next Steps for Development

- [ ] Transition the frontend to fetch real list data from the Express backend endpoints (e.g. `/api/destinations`).
- [ ] Implement Mongoose schemas and models for `Stay`, `Transport`, `Activities`, and `Food`.
- [ ] Connect the frontend's "Enquire" modal form to submit direct POST requests to the backend API.
