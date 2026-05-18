'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NotificationContextType {
  showAlert: (message: string, title?: string) => Promise<void>
  showConfirm: (message: string, title?: string) => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider')
  }
  return context
}

interface DialogState {
  isOpen: boolean
  type: 'alert' | 'confirm'
  title: string
  message: string
  resolve: ((val: boolean) => void) | null
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: 'alert',
    title: 'TripFlow',
    message: '',
    resolve: null
  })

  const showAlert = (message: string, title = 'TripFlow') => {
    return new Promise<void>((resolve) => {
      setDialog({
        isOpen: true,
        type: 'alert',
        title,
        message,
        resolve: () => {
          resolve()
        }
      })
    })
  }

  const showConfirm = (message: string, title = 'TripFlow dice') => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        resolve: (val: boolean) => {
          resolve(val)
        }
      })
    })
  }

  const handleAction = (value: boolean) => {
    if (dialog.resolve) {
      dialog.resolve(value)
    }
    setDialog(prev => ({ ...prev, isOpen: false, resolve: null }))
  }

  return (
    <NotificationContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className={cn(
              "w-full max-w-[420px] rounded-2xl bg-[#1c1d1f] p-6 shadow-2xl border border-slate-800 text-left relative",
              "animate-in zoom-in-95 duration-200"
            )}
          >
            {/* Header / Title */}
            <h3 className="text-white font-extrabold text-sm sm:text-base tracking-wide leading-none mb-3">
              {dialog.title}
            </h3>

            {/* Message Body */}
            <p className="text-slate-350 text-[13px] sm:text-[14px] leading-relaxed mb-6 font-medium">
              {dialog.message}
            </p>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-2.5">
              {dialog.type === 'confirm' && (
                <button
                  type="button"
                  onClick={() => handleAction(false)}
                  className="bg-[#2c2d30] hover:bg-[#3d3e42] active:scale-[0.98] text-slate-300 font-semibold text-xs sm:text-[13px] px-5 py-2.5 rounded-full transition-all focus:outline-hidden"
                >
                  Cancelar
                </button>
              )}
              <button
                type="button"
                onClick={() => handleAction(true)}
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold text-xs sm:text-[13px] px-6 py-2.5 rounded-full transition-all focus:ring-2 focus:ring-emerald-500/50 focus:outline-hidden"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  )
}
