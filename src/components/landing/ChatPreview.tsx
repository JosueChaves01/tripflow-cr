'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { MapPin, Sparkles, User, Heart, Leaf } from 'lucide-react'
import { useI18n } from '@/i18n'

interface Message {
  id: number
  text: string
  isUser: boolean
  status: 'pending' | 'typing' | 'complete'
}

const CONVERSATIONS = {
  en: [
    {
      id: 'adventure',
      icon: Sparkles,
      titleKey: 'adventureTrip',
      messages: [
        { text: "I'm planning a vacation in Costa Rica, I love adrenaline and want to stay a month in the country. What recommendations do you have?", isUser: true },
        { text: "Hello, I see you're the adventurous type! Costa Rica has many adrenaline-filled activities. To recommend the best options and create your adventure plan, I'd like to know some details: when would be your arrival date? Or do you prefer I suggest dates with better availability and weather?", isUser: false },
        { text: "Surprise me, recommend a month (31 days) to have a great time doing adrenaline-filled activities.", isUser: true },
        { text: "That's the adventurous spirit I like! But before I give you my best recommendation, I need to know some details: What's your approximate budget? Are you coming alone or with friends/family? Are you planning to rent a car or prefer staying near the activities?", isUser: false },
      ]
    },
    {
      id: 'family',
      icon: Leaf,
      titleKey: 'familyTrip',
      messages: [
        { text: "We want to travel as a family to Costa Rica in December, we're two adults and three kids aged 3, 7, and 10", isUser: true },
        { text: "What a special adventure! December is a perfect time to visit Costa Rica. To recommend the best family activities, I need some details: Do you have specific arrival and departure dates? What's your approximate budget? Do the kids prefer calmer activities or do they also like adventure?", isUser: false },
        { text: "We arrive on December 15th and leave on the 30th. Budget of $3000-$4000. The kids love nature and animals.", isUser: true },
        { text: "Perfect! With those dates you have 15 perfect days. I've found amazing activities for the whole family: dolphin watching in the Central Pacific, guided walks in Manuel Antonio where you can see monkeys and sloths, kayaking through mangroves, and a butterfly tour in a botanical garden. Would you like me to create a day-by-day itinerary?", isUser: false },
      ]
    },
    {
      id: 'romantic',
      icon: Heart,
      titleKey: 'romanticTrip',
      messages: [
        { text: "It's our anniversary and we want something special, romantic, with good hotel and restaurant reviews", isUser: true },
        { text: "Congratulations on the anniversary! What a special occasion. To create a memorable experience I need some details: How many days do you have available? Do you prefer a specific area of Costa Rica (beach, mountain, city)? What's your budget range for accommodation and food?", isUser: false },
        { text: "We're two, from February 10th to 15th. We like the beach but also want unique experiences. Medium-high budget.", isUser: true },
        { text: "I've found incredible options for you! In the Central Pacific there are boutique hotels with ocean views that have excellent reviews. For dining, there are oceanfront restaurants with fresh seafood that are also highly recommended. Would you like me to book a romantic suite, a private sunset sailing tour, and dinner at sunset?", isUser: false },
      ]
    }
  ],
  es: [
    {
      id: 'adventure',
      icon: Sparkles,
      titleKey: 'adventureTrip',
      messages: [
        { text: "Estoy pensando en planear vacaciones en Costa Rica, me gusta la adrenalina y quiero estar un mes en el país. ¿Qué recomendaciones me das?", isUser: true },
        { text: "¡Hola, veo que eres de los atrevidos enérgicos! En Costa Rica hay muchas actividades llenas de adrenalina. Para poder recomendarte las mejores opciones y crear tu plan de aventuras, me gustaría conocer algunos detalles: ¿cuándo sería tu fecha de llegada? ¿O prefieres que te sugiera fechas con mejor disponibilidad y clima?", isUser: false },
        { text: "Sorpréndeme, recomiéndame un mes (31 días) para pasarlo genial haciendo actividades llenas de adrenalina.", isUser: true },
        { text: "¡Esa es la actitud aventurera que me gusta! Pero antes de darte mi mejor recomendación, necesito conocer algunos detalles: ¿Cuál es tu presupuesto aproximado? ¿Vienes solo o con amigos/familia? ¿Tienes pensado alquilar un auto o prefieres quedarte cerca de las actividades?", isUser: false },
      ]
    },
    {
      id: 'family',
      icon: Leaf,
      titleKey: 'familyTrip',
      messages: [
        { text: "Queremos viajar en familia a Costa Rica en diciembre, somos dos adultos y tres niños de 3, 7 y 10 años", isUser: true },
        { text: "¡Qué aventura tan especial! Diciembre es una época perfecta para visitar Costa Rica. Para recomendarles las mejores actividades familiares, necesito algunos detalles: ¿Ya tienen fechas específicas de llegada y salida? ¿Cuál es su presupuesto aproximado? ¿Los niños prefieren actividades más tranquilas o también les gusta la aventura?", isUser: false },
        { text: "Llegamos el 15 de diciembre y nos vamos el 30. Presupuesto de $3000-$4000. Los niños aman la naturaleza y los animales.", isUser: true },
        { text: "¡Perfecto! Con esas fechas tienen 15 días perfectos. He encontrado actividades increíbles para toda la familia: avistamiento de delfines en el Pacífico Central, caminatas guiadas en Manuel Antonio donde podrán ver monos y perezosos, paseo en kayak por manglares, y un tour de mariposas en un jardín botánico. ¿Les gustaría que les arme un itinerario día por día?", isUser: false },
      ]
    },
    {
      id: 'romantic',
      icon: Heart,
      titleKey: 'romanticTrip',
      messages: [
        { text: "Es nuestro aniversario y queremos algo especial, romántico, con buenas reseñas en hoteles y restaurantes", isUser: true },
        { text: "¡Felicidades por el aniversario! Qué ocasión tan especial. Para crear una experiencia memorable necesito algunos detalles: ¿Cuántos días tienen disponibles? ¿Prefieren una zona específica de Costa Rica (playa, montaña, ciudad)? ¿Cuál es su rango de presupuesto para alojamiento y comidas?", isUser: false },
        { text: "Somos dos, del 10 al 15 de febrero. Nos gusta la playa pero también queremos experiencias únicas. Presupuesto medio-alto.", isUser: true },
        { text: "¡He encontrado opciones increíbles para ustedes! En el Pacífico Central hay hoteles boutique con vista al mar que tienen reseñas excelentes. Para comer, hay restaurantes frente al océano con mariscos frescos que también son muy recomendados. ¿Les gustaría que reserve una suite romántica, un tour privado de sunset sailing, y cena en el atardecer?", isUser: false },
      ]
    }
  ]
}

export function ChatPreview() {
  const { t, language } = useI18n()
  const [activeConversation, setActiveConversation] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [key, setKey] = useState(0)

  const conversations = CONVERSATIONS[language]

  // Reset when language changes
  useEffect(() => {
    setActiveConversation(0)
    setIsAutoPlaying(true)
    setKey(k => k + 1)
  }, [language])

  // Initialize messages for current conversation
  useEffect(() => {
    setMessages(conversations[0].messages.map((msg, idx) => ({
      id: idx,
      text: msg.text,
      isUser: msg.isUser,
      status: 'pending' as const,
    })))
  }, [key, conversations])

  // Auto-play animation
  useEffect(() => {
    if (!isAutoPlaying) return

    const timers: NodeJS.Timeout[] = []
    const currentConv = conversations[activeConversation]

    currentConv.messages.forEach((_, idx) => {
      const baseDelay = 500 + idx * 3500

      timers.push(setTimeout(() => {
        setMessages(prev => prev.map((m, i) =>
          i === idx ? { ...m, status: 'typing' } : m
        ))
      }, baseDelay))

      const textLength = currentConv.messages[idx].text.length
      const typingDuration = Math.min(textLength * 30, 1500)

      timers.push(setTimeout(() => {
        setMessages(prev => prev.map((m, i) =>
          i === idx ? { ...m, status: 'complete' } : m
        ))
      }, baseDelay + typingDuration + 800))
    })

    const totalDuration = 500 + currentConv.messages.length * 3500 + 2000
    timers.push(setTimeout(() => {
      if (activeConversation < conversations.length - 1) {
        setActiveConversation(prev => prev + 1)
      } else {
        setIsAutoPlaying(false)
      }
    }, totalDuration))

    return () => timers.forEach(clearTimeout)
  }, [activeConversation, isAutoPlaying, key, conversations])

  // Reset messages when conversation changes during auto-play
  useEffect(() => {
    if (isAutoPlaying && key > 0) {
      setMessages(conversations[activeConversation].messages.map((msg, idx) => ({
        id: idx,
        text: msg.text,
        isUser: msg.isUser,
        status: 'pending' as const,
      })))
    }
  }, [activeConversation, isAutoPlaying, key, conversations])

  const currentConv = conversations[activeConversation]
  const IconComponent = currentConv.icon

  return (
    <div className="flex flex-col gap-6" key={key}>
      {/* Header */}
      <div className="text-center bg-slate-50 rounded-2xl py-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium mb-4">
          <Sparkles size={16} />
          <span>{t('tripflowAIAssistant')}</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {t('chatWithTravelGuide')}
        </h2>
        <p className="mt-3 text-lg text-slate-700 max-w-2xl mx-auto">
          {t('chatDescription')}
        </p>
      </div>

      {/* Conversation tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {conversations.map((conv, idx) => {
          const Icon = conv.icon
          return (
            <button
              key={conv.id}
              onClick={() => {
                setActiveConversation(idx)
                setIsAutoPlaying(false)
                setMessages(conversations[idx].messages.map((msg, i) => ({
                  id: i,
                  text: msg.text,
                  isUser: msg.isUser,
                  status: 'complete' as const,
                })))
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                idx === activeConversation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              )}
            >
              <Icon size={14} />
              <span>{t(conv.titleKey as any)}</span>
            </button>
          )
        })}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Chat header */}
        <button
          onClick={() => {
            setIsAutoPlaying(false)
            setMessages(conversations[activeConversation].messages.map((msg, i) => ({
              id: i,
              text: msg.text,
              isUser: msg.isUser,
              status: 'complete' as const,
            })))
          }}
          className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50 w-full text-left hover:bg-slate-100/50 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
            <IconComponent size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{t('tripflowAssistant')}</p>
            <p className="text-sm text-slate-500">{t(currentConv.titleKey as any)}</p>
          </div>
        </button>

        {/* Messages */}
        <div className="p-6 space-y-4 min-h-[320px] max-h-[400px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-3',
                message.isUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!message.isUser && (
                <div className={cn(
                  'flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center transition-all duration-300',
                  message.status === 'pending' && 'opacity-0 translate-y-2',
                  message.status === 'typing' && 'opacity-100 translate-y-0',
                  message.status === 'complete' && 'opacity-100 translate-y-0'
                )}>
                  <MapPin size={14} />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-300',
                  message.isUser
                    ? 'bg-slate-900 text-white rounded-br-md'
                    : 'bg-slate-100 text-slate-800 rounded-bl-md',
                  message.status === 'pending' && 'opacity-0 translate-y-2',
                  message.status === 'typing' && 'opacity-100 translate-y-0',
                  message.status === 'complete' && 'opacity-100 translate-y-0'
                )}
              >
                {message.status === 'typing' ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                  </span>
                ) : (
                  <p>{message.text}</p>
                )}
              </div>

              {message.isUser && (
                <div className={cn(
                  'flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center transition-all duration-300',
                  message.status === 'pending' && 'opacity-0 translate-y-2',
                  message.status === 'typing' && 'opacity-100 translate-y-0',
                  message.status === 'complete' && 'opacity-100 translate-y-0'
                )}>
                  <User size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat input simulation */}
        <button
          onClick={() => {
            setIsAutoPlaying(false)
            setMessages(conversations[activeConversation].messages.map((msg, i) => ({
              id: i,
              text: msg.text,
              isUser: msg.isUser,
              status: 'complete' as const,
            })))
          }}
          className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 w-full text-left hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 py-3 bg-white rounded-full border border-slate-200 text-sm text-slate-400">
              {t('tryAskingMe')}
            </div>
            <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
              <Sparkles size={18} />
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}