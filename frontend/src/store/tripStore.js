import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTripStore = create(
  persist(
    (set, get) => ({
      // Destination
      destination: null,
      setDestination: (dest) => set({ destination: dest }),

      // Trip config
      members: 2,
      setMembers: (n) => set({ members: n }),

      budget: 15000,
      setBudget: (b) => set({ budget: b }),

      budgetType: "per_person", // "per_person" | "total"
      setBudgetType: (t) => set({ budgetType: t }),

      dateRange: { start: null, end: null },
      setDateRange: (range) => set({ dateRange: range }),

      selectedActivities: [],
      toggleActivity: (activity) =>
        set((state) => ({
          selectedActivities: state.selectedActivities.includes(activity)
            ? state.selectedActivities.filter((a) => a !== activity)
            : [...state.selectedActivities, activity],
        })),

      tripName: "",
      setTripName: (name) => set({ tripName: name }),

      // Booking cart (Activities)
      cart: [],
      addToCart: (item) =>
        set((state) => ({
          cart: state.cart.find((i) => i.id === item.id)
            ? state.cart
            : [...state.cart, item],
        })),
      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),

      // Selected Hotel
      selectedHotel: null,
      selectHotel: (hotel) => set({ selectedHotel: hotel }),
      clearHotel: () => set({ selectedHotel: null }),

      // Computed
      getTotalCost: () => {
        const { cart, selectedHotel } = get();
        const activitiesCost = cart.reduce((sum, item) => sum + (item.price || 0), 0);
        const hotelCost = selectedHotel ? (selectedHotel.price || 0) : 0;
        return activitiesCost + hotelCost;
      },

      getCostPerPerson: () => {
        const { members } = get();
        const total = get().getTotalCost();
        return Math.round(total / members);
      },

      getRemainingBudget: () => {
        const { budget, budgetType, members } = get();
        const totalBudget = budgetType === "per_person" ? budget * members : budget;
        return totalBudget - get().getTotalCost();
      },

      // Payment state
      isPaid: false,
      setPaid: (val) => set({ isPaid: val }),

      // Reset
      reset: () =>
        set({
          destination: null,
          members: 2,
          budget: 15000,
          dateRange: { start: null, end: null },
          selectedActivities: [],
          tripName: "",
          cart: [],
          selectedHotel: null,
        }),
    }),
    { name: "luxe-trip-store" }
  )
);

export default useTripStore;
