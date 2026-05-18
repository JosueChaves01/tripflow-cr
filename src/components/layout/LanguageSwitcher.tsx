'use client'

import { Globe, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import type { Language } from '@/i18n'

const languageLabels: Record<Language, string> = {
  en: 'English',
  es: 'Español',
}

const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  es: '🇨🇷',
}

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en')
  }

  const setLanguageWithCookie = (lang: Language) => {
    // Set cookie for server-side persistence
    document.cookie = `tf_language=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    setLanguage(lang)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
        )}
        aria-label={t('changeLanguage')}
      >
        <Globe size={18} />
        <span className="hidden sm:inline">{languageFlags[language]}</span>
        <span className="text-xs">{language.toUpperCase()}</span>
        <ChevronDown size={14} className={cn('transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                setLanguageWithCookie('en')
                setIsOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors',
                language === 'en' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <span className="text-base">{languageFlags.en}</span>
              <span>{languageLabels.en}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguageWithCookie('es')
                setIsOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors',
                language === 'es' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <span className="text-base">{languageFlags.es}</span>
              <span>{languageLabels.es}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}