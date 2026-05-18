'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MapPin, CalendarDays, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
import { UserMenu } from '@/components/layout/UserMenu'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { ChatPreview } from '@/components/landing/ChatPreview'
import { useI18n } from '@/i18n'
import type { UserProfile } from '@/types'

interface LandingContentProps {
  user: { id: string; email?: string } | null
  profile: UserProfile | null
}

export function LandingContent({ user, profile }: LandingContentProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <MapPin size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">{t('tripflowCr')}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <>
                <Link href={profile?.role === 'provider' || profile?.role === 'admin' ? '/provider/dashboard' : '/dashboard'}>
                  <Button variant="ghost" className="hidden sm:inline-flex">{t('dashboard')}</Button>
                </Link>
                <UserMenu user={profile} />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:inline-flex">{t('signIn')}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">{t('getStarted')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 pt-24 pb-32 sm:px-6 lg:px-8 lg:pt-32">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#10b981] to-[#3b82f6] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="success" className="mb-6 px-3 py-1">
              <Sparkles size={14} className="mr-1 inline" />
              {t('aiPoweredTravelPlanning')}
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              {t('experienceCostaRica')} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                {t('tailoredForYou')}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {t('discoverHiddenWaterfalls')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/itinerary">
                <Button size="lg" className="w-full sm:w-auto group">
                  {t('buildAIItinerary')}
                  <Sparkles size={18} className="ml-2 group-hover:animate-pulse" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto group">
                  {t('exploreActivities')}
                  <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ChatPreview */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
          <ChatPreview />
        </div>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">

            {/* Feature 1 */}
            <div className="group relative flex flex-col items-start gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{t('smartItineraries')}</h3>
              <p className="text-slate-600">
                {t('smartItinerariesDesc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative flex flex-col items-start gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <CalendarDays size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{t('seamlessBooking')}</h3>
              <p className="text-slate-600">
                {t('seamlessBookingDesc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative flex flex-col items-start gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{t('trustedProviders')}</h3>
              <p className="text-slate-600">
                {t('trustedProvidersDesc')}
              </p>
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="relative mt-12 bg-emerald-900 py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('readyForThePuraVida')}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-emerald-100">
              {t('joinThousandsOfTravelers')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-emerald-900 hover:bg-slate-100">
                  {t('createFreeAccount')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:px-6 lg:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-emerald-600" />
            <span className="text-lg font-bold text-slate-900">{t('tripflowCr')}</span>
          </div>
          <p className="mt-4 text-sm text-slate-500 lg:mt-0">
            &copy; {new Date().getFullYear()} TripFlow Costa Rica. {t('allRightsReserved')}
          </p>
        </div>
      </footer>
    </div>
  )
}