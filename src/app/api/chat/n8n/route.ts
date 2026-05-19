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

    // 3. Inject system prompt instructions to force the n8n agent to fetch real database IDs
    const systemPrompt = {
      role: 'system',
      content: `Eres el Planificador de Viajes Experto de TripFlow Costa Rica.
INSTRUCCIONES DE BÚSQUEDA Y ASOCIACIÓN DE BASE DE DATOS OBLIGATORIAS:
1. NUNCA inventes identificadores, nombres ni detalles de actividades, hoteles (alojamiento) o restaurantes.
2. Cada vez que sugieras o generes un itinerario en Costa Rica, DEBES usar tu herramienta SQL o Supabase para buscar en las tablas ('public.activities', 'public.hotels', 'public.restaurants') registros reales que coincidan.
3. Para cada actividad, hotel y restaurante en el itinerario final dentro del bloque <PREFERENCES>...</PREFERENCES>:
   - DEBES incluir obligatoriamente su UUID real de la base de datos (campo 'id') en la propiedad 'id'.
   - Si no encuentras un registro idéntico, busca la opción real más cercana disponible y usa su 'id' real. No uses texto libre ni marcadores de posición para el ID.
   - El itinerario guardado DEBE contener IDs físicos y reales para habilitar la reserva directa.`
    }

    const updatedMessages = [systemPrompt, ...messages]

    // 4. Forward to n8n webhook
    // We send the entire chat history and inject the user_id so n8n can query Supabase on their behalf
    const payload = {
      user_id: user.id,
      email: user.email,
      messages: updatedMessages,
      preferences: preferences || null
    }

    // Helper function to extract and parse preferences from XML tags
    const extractPreferences = (responseText: string) => {
      let cleanResponse = responseText
      let extractedPreferences = null

      const match = responseText.match(/<(?:SAVE_)?PREFERENCES>([\s\S]*?)<\/(?:SAVE_)?PREFERENCES>/i)
      if (match) {
        try {
          extractedPreferences = JSON.parse(match[1].trim())
          cleanResponse = responseText.replace(match[0], '').trim()
        } catch (e) {
          console.error("Failed to parse preferences JSON from LLM output:", e)
          // Even if parsing fails, we should still strip the tag so it doesn't show in the UI
          cleanResponse = responseText.replace(match[0], '').trim()
        }
      }
      return { cleanResponse, extractedPreferences }
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
      
      // If n8n didn't parse the XML internally, we parse it here as a fallback
      if (data.response && !data.preferences) {
        const { cleanResponse, extractedPreferences } = extractPreferences(data.response)
        data.response = cleanResponse
        if (extractedPreferences) {
          data.preferences = extractedPreferences
        }
      }
      
      return NextResponse.json(data)
    } else {
      // MOCK RESPONSE for UI development when n8n is not yet connected
      await new Promise(r => setTimeout(r, 1500))
      
      const lastMessage = messages[messages.length - 1].content.toLowerCase()
      
      // Mock LLM detecting a change in preferences via text
      if (lastMessage.includes('tamarindo')) {
        return NextResponse.json({
          response: "¡Excelente elección! Tamarindo es hermoso. He actualizado tu destino a Tamarindo.",
          action: "chat",
          preferences: { ...preferences, destination: "Tamarindo" }
        })
      }

      if (lastMessage.includes('confirm') || lastMessage.includes('yes') || lastMessage.includes('listo')) {
        return NextResponse.json({
          response: "¡Excelente! He guardado tu itinerario. Te redirigiré para que puedas verlo ahora mismo.",
          action: "itinerary_saved"
        })
      }
      
      if (preferences) {
        return NextResponse.json({
          response: `¡Perfecto! Veo que has configurado tus preferencias para viajar a ${preferences.destination} por ${preferences.duration} días con ${preferences.travelers} personas. Tu presupuesto es ${preferences.budget === 'budget' ? 'Económico' : preferences.budget === 'moderate' ? 'Moderado' : 'Lujo'} y deseas incluir ${preferences.services.join(', ')}.\n\n¿Deseas que te muestre las mejores recomendaciones de alojamiento o tienes algún otro requerimiento especial?`,
          action: "chat"
        })
      }

      return NextResponse.json({
        response: "Entiendo. Para poder recomendarte el mejor itinerario, ¿podrías indicarme para cuántas personas es el viaje y cuál es su presupuesto aproximado?",
        action: "chat"
      })
    }
  } catch (error: any) {
    console.error('Error forwarding to n8n:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

