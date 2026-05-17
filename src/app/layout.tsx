import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// Agent-UI: Extend this layout with a Providers wrapper component
// that wraps children with any context providers needed (e.g. Toaster, etc.)

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'TripFlow CR — Discover Costa Rica',
    template: '%s | TripFlow CR',
  },
  description:
    'Plan and book your perfect Costa Rica adventure with AI-powered itineraries, curated local activities, and seamless checkout.',
  keywords: ['Costa Rica', 'travel', 'itinerary', 'booking', 'adventure'],
  openGraph: {
    title: 'TripFlow CR',
    description: 'AI-powered Costa Rica travel planning',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Agent-UI: Add <Providers> wrapper here when ready */}
        {children}
      </body>
    </html>
  )
}
