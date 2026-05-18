import { createClient } from '@/lib/supabase/server'
import { LandingContent } from '@/components/landing/LandingContent'
import { UserProfile } from '@/types'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: UserProfile | null = null
  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    profile = profileData || {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'tourist',
      full_name: user.user_metadata?.full_name || '',
      created_at: user.created_at
    }
  }

  return (
    <>
      <LandingContent user={user} profile={profile} />
    </>
  )
}