'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MapPin, Sparkles, User, Send, Loader2 } from 'lucide-react'
import { useI18n } from '@/i18n'
import { Button } from '@/components/ui/Button'
import { PreChatPreferences, PreChatData } from './PreChatPreferences'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
}

const VIBES_MAP: Record<string, string> = {
  adventure: 'Aventura 🌋',
  relaxation: 'Relax & Wellness 🧘',
  nature: 'Naturaleza y Flora 🦜',
  eco: 'Ecoturismo 🌿',
  luxury: 'Lujo Premium ✨'
}

export function ItineraryChat({ className }: { className?: string }) {
  const { t } = useI18n()
  const router = useRouter()
  
  const [showPreferences, setShowPreferences] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'msg-initial',
    content: "¡Hola! Soy tu Experto de Viajes TripFlow Costa Rica. Me encantaría ayudarte a planear el viaje perfecto. Para empezar, ¿me podrías contar un poco sobre qué tipo de viaje te gustaría hacer, para cuántas personas y en qué fechas estimadas?",
    role: 'assistant'
  }])
  
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handlePreferencesStart = async (data: PreChatData) => {
    setShowPreferences(false)
    setIsLoading(true)

    const formattedVibe = VIBES_MAP[data.vibe] || data.vibe
    const formattedBudget = data.budget === 'budget' ? 'Económico' : data.budget === 'moderate' ? 'Moderado' : 'Lujo'
    const formattedServices = data.services
      .map(s => s === 'hotels' ? 'Hoteles' : s === 'activities' ? 'Actividades' : 'Restaurantes')
      .join(', ')

    const userMessageContent = `¡Hola! Ya configuré mis preferencias para el viaje:
📍 Destino: ${data.destination}
📅 Duración: ${data.duration} días
👥 Viajeros: ${data.travelers} ${data.travelers === 1 ? 'persona' : 'personas'}
✨ Estilo: ${formattedVibe}
🪙 Presupuesto: ${formattedBudget}
🛠️ Servicios: ${formattedServices}`

    const newUserMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: userMessageContent,
      role: 'user'
    }

    setMessages(prev => [...prev, newUserMessage])

    try {
      const res = await fetch('/api/chat/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          preferences: data
        }),
      })

      if (!res.ok) {
        throw new Error('Error de conexión')
      }

      const resData = await res.json()

      const newAssistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: resData.response || "Lo siento, tuve un problema procesando tu respuesta.",
        role: 'assistant'
      }

      setMessages(prev => [...prev, newAssistantMessage])

      if (resData.action === 'itinerary_saved') {
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      }

    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, {
        id: `msg-error-${Date.now()}`,
        content: "Ocurrió un error al intentar conectarse con el asistente. Por favor, intenta de nuevo.",
        role: 'assistant'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!inputValue.trim() || isLoading) return

    const newUserMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: inputValue.trim(),
      role: 'user'
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const chatHistory = [...messages, newUserMessage]
      
      const res = await fetch('/api/chat/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatHistory }),
      })

      if (!res.ok) {
        throw new Error('Error de conexión')
      }

      const data = await res.json()

      const newAssistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: data.response || "Lo siento, tuve un problema procesando tu respuesta.",
        role: 'assistant'
      }

      setMessages(prev => [...prev, newAssistantMessage])

      if (data.action === 'itinerary_saved') {
        // Redirigir al usuario al dashboard de itinerarios para verlo
        setTimeout(() => {
          router.push('/dashboard') // Redirigir al dashboard o donde corresponda
        }, 3000)
      }

    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, {
        id: `msg-error-${Date.now()}`,
        content: "Ocurrió un error al intentar conectarse con el asistente. Por favor, intenta de nuevo.",
        role: 'assistant'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (showPreferences) {
    return (
      <div className={cn("flex flex-col gap-6 w-full max-w-3xl mx-auto", className)}>
        <PreChatPreferences
          onStart={handlePreferencesStart}
          onSkip={() => setShowPreferences(false)}
        />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-3xl mx-auto", className)}>
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/80 w-full text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{t('tripflowAIAssistant')}</p>
            <p className="text-sm text-slate-500">Planificador de Viajes Activo</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                  message.role === 'user'
                    ? 'bg-slate-900 text-white rounded-br-md'
                    : 'bg-white text-slate-800 rounded-bl-md border border-slate-200 shadow-sm'
                )}
              >
                {message.content}
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MapPin size={14} />
              </div>
              <div className="max-w-[80%] px-4 py-4 rounded-2xl bg-white rounded-bl-md border border-slate-200 shadow-sm">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                </span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form 
            onSubmit={handleSubmit}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full max-h-32 min-h-[52px] resize-none py-3 px-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm scrollbar-hide"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || isLoading}
              className="h-[52px] w-[52px] rounded-full shrink-0 flex items-center justify-center p-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:bg-slate-300"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </Button>
          </form>
          <p className="text-xs text-center text-slate-400 mt-2">
            El Asistente TripFlow puede buscar y agendar hoteles, restaurantes y actividades por ti.
          </p>
        </div>
      </div>
    </div>
  )
}
