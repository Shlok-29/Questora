/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        accent: {
          500: '#f97316', // Vibrant orange
          600: '#ea580c',
        },
        success: '#22c55e', // Green for crowd/availability
        warning: '#eab308', // Yellow for moderate
        danger: '#ef4444',  // Red for high crowd
        surface: '#ffffff',
        background: '#f8fafc',
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
        }
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse-soft": "pulseSoft 2s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        }
      },
    },
  },
  plugins: [],
};
