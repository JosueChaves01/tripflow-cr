import { minimax, MINIMAX_MODEL, MINIMAX_DEFAULTS } from '@/lib/minimax/client'
import { createClient } from '@/lib/supabase/server'
import { type Activity, type TravelPreferences, type ItineraryDay } from '@/types'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { preferences } = await request.json() as { preferences: TravelPreferences }

    const supabase = await createClient()
    let query = supabase.from('activities').select('*').eq('available', true)
    if (preferences.activity_types?.length) {
      query = query.in('category', preferences.activity_types)
    }
    const { data: activities } = await query
    const activityList = (activities as Activity[]) ?? []

    if (activityList.length === 0) {
      return NextResponse.json({ error: 'No activities found' }, { status: 400 })
    }

    const activityListText = activityList
      .map((a) => `[${a.id}] ${a.name} - ${a.category} - $${a.price} - ${a.location} - ${a.duration_minutes}min`)
      .join('\n')

    const budgetFilter = preferences.budget_range === 'low' ? 100 :
                         preferences.budget_range === 'medium' ? 250 : 500

    const SYSTEM_PROMPT = `You are TripFlow's travel planning AI for Costa Rica.
Given a list of available activities and user preferences, generate a day-by-day itinerary.
Respond ONLY with valid JSON matching this structure:
{ "days": [{ "day": 1, "date": "YYYY-MM-DD", "activities": ["activity-id-1", "activity-id-2"] }] }
Select activities that match the budget (max $${budgetFilter}/person/day), dates and preferences.
Distribute activities logically across days. Never invent activities — only use IDs from the provided list.`

    const response = await minimax.chat.completions.create({
      model: MINIMAX_MODEL,
      ...MINIMAX_DEFAULTS,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Preferences: ${JSON.stringify(preferences)}\nAvailable activities:\n${activityListText}`,
        },
      ],
    })

    const content = response.choices[0]?.message?.content ?? '{}'
    let parsed: { days: Array<{ day: number; date: string; activities: string[] }> }
    try {
      parsed = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    const itineraryDays: ItineraryDay[] = parsed.days.map((d) => ({
      day: d.day,
      date: d.date,
      activities: d.activities
        .map((id) => activityList.find((a) => a.id === id))
        .filter((a): a is Activity => a != null),
    }))

    const totalCost = itineraryDays.flatMap((d) => d.activities)
      .reduce((sum, a) => sum + a.price, 0) * (preferences.group_size || 1)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: itinerary, error: dbError } = await supabase
      .from('itineraries')
      .insert({
        user_id: user.id,
        preferences,
        days: itineraryDays as any,
        total_cost: totalCost,
      })
      .select()
      .single()

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

    return NextResponse.json({ id: itinerary.id, days: itineraryDays, total_cost: totalCost })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}