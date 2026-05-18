'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useTripFlowStore } from '@/store'
import { I18nProvider } from '@/i18n'
import { NotificationProvider } from '@/components/ui/NotificationProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  const setUser = useTripFlowStore((s) => s.setUser)
  const setLanguage = useTripFlowStore((s) => s.setLanguage)

  useEffect(() => {
    // Sync language from cookie on mount
    const languageCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('tf_language='))
    if (languageCookie) {
      const lang = languageCookie.split('=')[1] as 'en' | 'es'
      if (lang === 'en' || lang === 'es') {
        setLanguage(lang)
      }
    }
  }, [setLanguage])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUser(data as any)
          })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) setUser(data as any)
          })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, setUser])

  return (
    <I18nProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </I18nProvider>
  )
}