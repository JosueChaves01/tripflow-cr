'use server'

import { createClient } from '@/lib/supabase/server'
import { type Car } from '@/types'

export async function getCars(filters?: { location?: string; query?: string; page?: number; limit?: number }): Promise<{ data: Car[]; count: number }> {
  const supabase = await createClient()
  let q: any = supabase
    .from('cars')
    .select('*', { count: 'exact' })
    .eq('available', true)

  if (filters?.location) {
    q = q.ilike('location', `%${filters.location}%`)
  }
  if (filters?.query) {
    // search make or model
    q = q.or(`make.ilike.%${filters.query}%,model.ilike.%${filters.query}%`)
  }

  const limit = filters?.limit || 12
  const page = filters?.page || 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  q = q.range(from, to)

  const { data, count, error } = await q
  if (error) return { data: [], count: 0 }
  return { data: data as Car[], count: count || 0 }
}

export async function getCarDetails(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .select(`*, provider:providers(*)`)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createCarRental(input: {
  car_id: string
  start_date: string
  end_date: string
  total_price: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('car_rentals')
    .insert({
      car_id: input.car_id,
      user_id: user.id,
      start_date: input.start_date,
      end_date: input.end_date,
      total_price: input.total_price,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}
