import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// N8N Webhook URL (configure this in .env.local and Vercel)
// If not set, it points to a placeholder
const N8N_WEBHOOK_URL = process.env.NEXT_N8N_WEBHOOK_URL || 'https://n8n.example.com/webhook/tripflow-itinerary-agent'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse request body
    const body = await req.json()
    const { messages, preferences } = body
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 })
    }

    // 3. Forward to n8n webhook
    // We send the entire chat history and inject the user_id so n8n can query Supabase on their behalf
    const payload = {
      user_id: user.id,
      email: user.email,
      messages: messages,
      preferences: preferences || null
    }

    // Check if a real n8n webhook is set (not the placeholder example)
    const isRealWebhook = N8N_WEBHOOK_URL && !N8N_WEBHOOK_URL.includes('example.com')

    if (isRealWebhook) {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`n8n webhook responded with status: ${response.status}`)
      }

      const data = await response.json()
      
      // We expect n8n to respond with an object that might include the agent's text response
      // and optional action flags (like "itinerary_saved")
      return NextResponse.json(data)
    } else {
      // MOCK RESPONSE for UI development when n8n is not yet connected
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1500))
      
      if (preferences) {
        return NextResponse.json({
          response: `¡Perfecto! Veo que has configurado tus preferencias para viajar a ${preferences.destination} por ${preferences.duration} días con ${preferences.travelers} personas. Tu presupuesto es ${preferences.budget === 'budget' ? 'Económico' : preferences.budget === 'moderate' ? 'Moderado' : 'Lujo'} y deseas incluir ${preferences.services.join(', ')}.\n\nHe buscado opciones de hoteles de lujo en la base de datos de ${preferences.destination}. ¿Deseas que te muestre las mejores recomendaciones de alojamiento?`,
          action: "chat"
        })
      }

      const lastMessage = messages[messages.length - 1].content.toLowerCase()
      
      if (lastMessage.includes('confirm') || lastMessage.includes('yes') || lastMessage.includes('listo')) {
        // Mock successful generation
        return NextResponse.json({
          response: "¡Excelente! He guardado tu itinerario. Te redirigiré para que puedas verlo ahora mismo.",
          action: "itinerary_saved"
        })
      }
      
      return NextResponse.json({
        response: "Entiendo. Para poder recomendarte el mejor itinerario, ¿podrías indicarme para cuántas personas es el viaje y cuál es su presupuesto aproximado (Bajo, Medio, Alto)?",
        action: "chat"
      })
    }
  } catch (error: any) {
    console.error('Error forwarding to n8n:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
