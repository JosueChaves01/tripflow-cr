'use client'

import { useState, useTransition } from 'react'
import { logoutUser } from '@/features/auth/actions'
import { useI18n } from '@/i18n'
import { UserProfile } from '@/types'
import { LogOut, User } from 'lucide-react'

interface UserMenuProps {
  user: UserProfile | null
}

export function UserMenu({ user }: UserMenuProps) {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!user) {
    return (
      <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse"></div>
    )
  }

  // Safely get initials, handling nulls or empty spaces
  const cleanName = (user.full_name || '').trim()
  const initials = cleanName
    ? cleanName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : (user.email || 'U').substring(0, 2).toUpperCase()

  const handleLogout = () => {
    startTransition(() => {
      logoutUser()
    })
  }

  return (
    <div className="relative ml-3">
      <div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
        >
          <span className="sr-only">Open user menu</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold shadow-sm">
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-slate-700 md:block">
            {user.full_name || user.email}
          </span>
        </button>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-900 truncate">{user.full_name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              <div className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {user.role}
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <LogOut size={16} className="mr-2" />
              {isPending ? t('signingOut') : t('signOut')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
