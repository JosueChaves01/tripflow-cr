import { create } from 'zustand'
import type { UserProfile, TravelPreferences, Itinerary, Booking } from '@/types'

/**
 * TripFlow global Zustand store.
 *
 * Slice ownership is strictly enforced — each slice is written to
 * only by its designated agent (see AGENTS.md).
 *
 * All agents may READ any slice.
 */
interface TripFlowStore {
  /** owner: Agent-AUTH */
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void

  /** owner: Agent-ITINERARY */
  preferences: TravelPreferences | null
  setPreferences: (preferences: TravelPreferences | null) => void

  /** owner: Agent-ITINERARY */
  currentItinerary: Itinerary | null
  setCurrentItinerary: (itinerary: Itinerary | null) => void

  /** owner: Agent-BOOKINGS */
  selectedBookings: Booking[]
  setSelectedBookings: (bookings: Booking[]) => void
  addBooking: (booking: Booking) => void
  removeBooking: (bookingId: string) => void
}

export const useTripFlowStore = create<TripFlowStore>((set) => ({
  // Auth slice
  user: null,
  setUser: (user) => set({ user }),

  // Itinerary slices
  preferences: null,
  setPreferences: (preferences) => set({ preferences }),

  currentItinerary: null,
  setCurrentItinerary: (currentItinerary) => set({ currentItinerary }),

  // Bookings slice
  selectedBookings: [],
  setSelectedBookings: (selectedBookings) => set({ selectedBookings }),
  addBooking: (booking) =>
    set((state) => ({ selectedBookings: [...state.selectedBookings, booking] })),
  removeBooking: (bookingId) =>
    set((state) => ({
      selectedBookings: state.selectedBookings.filter((b) => b.id !== bookingId),
    })),
}))
