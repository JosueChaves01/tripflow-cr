import { createClient } from '@/lib/supabase/server'
import { Navbar, NavLink } from '@/components/layout/Navbar'
import { UserMenu } from '@/components/layout/UserMenu'
import { redirect } from 'next/navigation'
import { UserProfile } from '@/types'

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  const profile: UserProfile = profileData || {
    id: user.id,
    email: user.email!,
    role: user.user_metadata?.role || 'tourist',
    full_name: user.user_metadata?.full_name || '',
    created_at: user.created_at
  }

  if (profile.role !== 'provider' && profile.role !== 'admin') {
    redirect('/dashboard') // Redirect tourists away from provider dashboard
  }

  const providerLinks: NavLink[] = [
    { label: 'My Activities', href: '/provider/dashboard' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar links={providerLinks} userMenu={<UserMenu user={profile} />} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
