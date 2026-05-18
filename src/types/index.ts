export type UserRole = 'tourist' | 'provider' | 'admin'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name: string
  created_at: string
}

export interface TravelPreferences {
  activity_types: string[]
  budget_range: 'low' | 'medium' | 'high'
  start_date: string
  end_date: string
  location: string
  group_size: number
}

export interface Activity {
  id: string
  provider_id: string
  name: string
  description: string
  price: number
  location: string
  duration_minutes: number
  category: string
  available: boolean
  images: string[]
  included?: string[]
  requirements?: string[]
  lat?: number
  lng?: number
  created_at: string
}

export interface ItineraryDay {
  day: number
  date: string
  activities: Activity[]
}

export interface Itinerary {
  id: string
  user_id: string
  preferences: TravelPreferences
  days: ItineraryDay[]
  total_cost: number
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  activity_id?: string
  hotel_id?: string
  restaurant_id?: string
  itinerary_id?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  date: string
  group_size: number
  total_price: number
  stripe_payment_intent_id?: string
  created_at: string
}

export interface Provider {
  id: string
  user_id: string
  business_name: string
  description: string
  contact_email: string
  phone: string
  verified: boolean
  created_at: string
}

export interface Review {
  id: string
  activity_id?: string
  hotel_id?: string
  restaurant_id?: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
}

export interface Hotel {
  id: string
  provider_id: string
  name: string
  description: string
  price_per_night: number
  location: string
  stars: number
  category: string
  available: boolean
  images: string[]
  amenities?: string[]
  policies?: string[]
  lat?: number
  lng?: number
  created_at: string
}

export interface Restaurant {
  id: string
  provider_id: string
  name: string
  description: string
  price_range: string
  location: string
  cuisine: string
  category: string
  available: boolean
  images: string[]
  specialties?: string[]
  schedule?: string[]
  lat?: number
  lng?: number
  created_at: string
}
