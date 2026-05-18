import { cn } from '@/lib/utils'
import { type HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-white p-4',
          variant === 'elevated' && 'shadow-lg',
          variant === 'default' && 'border border-slate-200',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'