'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const CreateBookingSchema = z.object({
  activity_id: z.string(),
  itinerary_id: z.string().optional(),
  date: z.string().min(1),
  group_size: z.number().min(1),
  total_price: z.number(),
})

export async function createBooking(input: z.infer<typeof CreateBookingSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      activity_id: input.activity_id,
      itinerary_id: input.itinerary_id ?? null,
      date: input.date,
      group_size: input.group_size,
      total_price: input.total_price,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/booking')
  return { data }
}

export async function getUserBookings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('bookings')
    .select('*, activity:activities(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function cancelBooking(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/booking')
}