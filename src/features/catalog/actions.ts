'use server'
import { createClient } from '@/lib/supabase/server'
import { type Activity, type Hotel, type Restaurant } from '@/types'

export async function getActivities(filters?: {
  category?: string
  location?: string
  query?: string
  page?: number
  limit?: number
}): Promise<{ data: Activity[]; count: number }> {
  const supabase = await createClient()
  let query = supabase
    .from('activities')
    .select('*', { count: 'exact' })
    .eq('available', true)

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters?.query) {
    query = query.ilike('name', `%${filters.query}%`)
  }

  const limit = filters?.limit || 12
  const page = filters?.page || 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) return { data: [], count: 0 }
  return { data: data as Activity[], count: count || 0 }
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Activity
}

export async function getActivityDetails(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      provider:providers(*),
      reviews(
        *,
        user:profiles(full_name)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// ============================================================
// Hotels
// ============================================================
export async function getHotels(filters?: {
  category?: string
  location?: string
  query?: string
  page?: number
  limit?: number
}): Promise<{ data: Hotel[]; count: number }> {
  const supabase = await createClient()
  let q = supabase
    .from('hotels')
    .select('*', { count: 'exact' })
    .eq('available', true)

  if (filters?.category) {
    q = q.eq('category', filters.category)
  }
  if (filters?.location) {
    q = q.ilike('location', `%${filters.location}%`)
  }
  if (filters?.query) {
    q = q.ilike('name', `%${filters.query}%`)
  }

  const limit = filters?.limit || 12
  const page = filters?.page || 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  q = q.range(from, to)

  const { data, count, error } = await q
  if (error) return { data: [], count: 0 }
  return { data: data as Hotel[], count: count || 0 }
}

export async function getHotelDetails(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hotels')
    .select(`
      *,
      provider:providers(*),
      reviews(
        *,
        user:profiles(full_name)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// ============================================================
// Restaurants
// ============================================================
export async function getRestaurants(filters?: {
  category?: string
  location?: string
  query?: string
  page?: number
  limit?: number
}): Promise<{ data: Restaurant[]; count: number }> {
  const supabase = await createClient()
  let q = supabase
    .from('restaurants')
    .select('*', { count: 'exact' })
    .eq('available', true)

  if (filters?.category) {
    q = q.eq('category', filters.category)
  }
  if (filters?.location) {
    q = q.ilike('location', `%${filters.location}%`)
  }
  if (filters?.query) {
    q = q.ilike('name', `%${filters.query}%`)
  }

  const limit = filters?.limit || 12
  const page = filters?.page || 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  q = q.range(from, to)

  const { data, count, error } = await q
  if (error) return { data: [], count: 0 }
  return { data: data as Restaurant[], count: count || 0 }
}

export async function getRestaurantDetails(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      provider:providers(*),
      reviews(
        *,
        user:profiles(full_name)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}