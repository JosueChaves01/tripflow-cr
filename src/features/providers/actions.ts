'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ActivitySchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  location: z.string(),
  duration_minutes: z.number().positive(),
  category: z.string(),
  available: z.boolean().default(true),
  images: z.array(z.string()).default([]),
})

export async function createProvider(input: {
  business_name: string
  description: string
  contact_email: string
  phone: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('providers')
    .insert({ ...input, user_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/provider/dashboard')
  return { data }
}

export async function createActivity(input: z.infer<typeof ActivitySchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: provider } = await supabase
    .from('providers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!provider) return { error: 'Provider profile required' }

  const { data, error } = await supabase
    .from('activities')
    .insert({ ...input, provider_id: provider.id })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/provider/dashboard')
  return { data }
}

export async function updateActivity(id: string, input: Partial<z.infer<typeof ActivitySchema>>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('activities')
    .update(input)
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/provider/dashboard')
}

export async function getProviderBookings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: provider } = await supabase
    .from('providers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!provider) return []

  const { data } = await supabase
    .from('bookings')
    .select('*, activity:activities(*), user:profiles(*)')
    .eq('activity.provider_id', provider.id)

  return data ?? []
}