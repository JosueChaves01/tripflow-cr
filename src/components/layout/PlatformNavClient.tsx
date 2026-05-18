'use client'

import { Navbar, NavLink } from '@/components/layout/Navbar'
import { UserMenu } from '@/components/layout/UserMenu'
import { useI18n } from '@/i18n'
import type { UserProfile } from '@/types'

interface PlatformNavClientProps {
  profile: UserProfile
  children: React.ReactNode
}

export function PlatformNavClient({ profile, children }: PlatformNavClientProps) {
  const { t } = useI18n()

  const touristLinks: NavLink[] = [
    { label: t('dashboard'), href: '/dashboard' },
    { label: t('hotels'), href: '/hotels' },
    { label: t('restaurants'), href: '/restaurants' },
    { label: t('itineraries'), href: '/itinerary' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar links={touristLinks} userMenu={<UserMenu user={profile} />} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}