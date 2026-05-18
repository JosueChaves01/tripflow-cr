import { createClient } from '@/lib/supabase/server'
import { PlatformNavClient } from '@/components/layout/PlatformNavClient'
import { redirect } from 'next/navigation'
import { UserProfile } from '@/types'

export default async function PlatformLayout({
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
    role: 'tourist',
    full_name: user.user_metadata?.full_name || '',
    created_at: user.created_at
  }

  return <PlatformNavClient profile={profile}>{children}</PlatformNavClient>
}