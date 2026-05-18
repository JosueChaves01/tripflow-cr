'use client'
import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
}

export function Modal({ open, onClose, className, children, ...props }: ModalProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      {...props}
    >
      <div
        className={cn(
          'relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl',
          'focus:outline-none',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}