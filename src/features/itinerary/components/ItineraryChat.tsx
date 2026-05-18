'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MapPin, Sparkles, User, Send, Loader2, Trash2 } from 'lucide-react'
import { useI18n } from '@/i18n'
import { Button } from '@/components/ui/Button'
import { PreChatData } from './PreChatPreferences'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
}

interface ItineraryChatProps {
  preferences: PreChatData
  setPreferences: React.Dispatch<React.SetStateAction<PreChatData>>
  preferencesApplied: boolean
  setPreferencesApplied: (applied: boolean) => void
  className?: string
  onItinerarySaved?: () => void
  generatePlanTrigger?: number | null
}

export function ItineraryChat({ 
  className,
  preferences,
  setPreferences,
  preferencesApplied,
  setPreferencesApplied,
  onItinerarySaved,
  generatePlanTrigger
}: ItineraryChatProps) {
  const { t } = useI18n()
  const router = useRouter()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const INITIAL_MESSAGE: ChatMessage = {
    id: 'msg-initial',
    content: "¡Hola! Soy tu Experto de Viajes TripFlow Costa Rica. He recibido tus preferencias iniciales. Si deseas cambiar el destino, los días, tu presupuesto u otros detalles, puedes ajustarlos en el panel superior en cualquier momento, o simplemente pedírmelo por este chat.",
    role: 'assistant'
  }

  // 1. Load chat messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tripflow_chat_messages')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
          return
        }
      } catch (e) {
        console.error('Failed to parse saved chat messages:', e)
      }
    }
    // Fallback to initial message if no storage exists
    setMessages([INITIAL_MESSAGE])
  }, [])

  // 2. Persist chat messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('tripflow_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (!generatePlanTrigger) return

    const msgText = "Por favor, genera mi itinerario de viaje completo y detallado en base a mis preferencias aplicadas."
    handleSubmit(msgText)
  }, [generatePlanTrigger])

  const handleClearChat = () => {
    localStorage.removeItem('tripflow_chat_messages')
    setMessages([INITIAL_MESSAGE])
  }

  const handleSubmit = async (overrideValue?: string) => {
    const messageContent = overrideValue ?? inputValue
    if (!messageContent.trim() || isLoading) return

    const newUserMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: messageContent.trim(),
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
        body: JSON.stringify({ 
          messages: chatHistory,
          preferences: preferencesApplied ? preferences : null 
        }),
      })

      if (!res.ok) {
        throw new Error('Error de conexión')
      }

      const data = await res.json()

      // Sync React state if the AI updated the preferences dynamically
      if (data.preferences && typeof data.preferences === 'object') {
        setPreferences(prev => ({ ...prev, ...data.preferences }))
        setPreferencesApplied(true)
      }

      const newAssistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: data.response || "Lo siento, tuve un problema procesando tu respuesta.",
        role: 'assistant'
      }

      setMessages(prev => [...prev, newAssistantMessage])

      if (data.action === 'itinerary_saved') {
        if (onItinerarySaved) {
          onItinerarySaved()
        } else {
          setTimeout(() => {
            router.push('/dashboard')
          }, 3000)
        }
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

  return (
    <div className={cn("flex flex-col w-full h-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden", className)}>
      
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 w-full text-left relative z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{t('tripflowAIAssistant')}</p>
            <p className="text-xs text-slate-500 font-medium">Planificador de Viajes Activo</p>
          </div>
        </div>
        
        {messages.length > 1 && (
          <button
            type="button"
            onClick={handleClearChat}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100 cursor-pointer"
            title="Reiniciar conversación"
          >
            <Trash2 size={13} />
            Limpiar Chat
          </button>
        )}
      </div>

      {/* Chat Messages - Scrollable container */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/30 relative z-0 min-h-0">
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
                'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap text-left',
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

      {/* Chat Input - Fixed at bottom */}
      <div className="p-4 bg-white border-t border-slate-100 relative z-20 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
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
            disabled={isLoading}
            className="h-[52px] w-[52px] rounded-full shrink-0 flex items-center justify-center p-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:bg-slate-300"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </Button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
          El Asistente TripFlow adaptará el itinerario automáticamente si cambias de opinión.
        </p>
      </div>
    </div>
  )
}
