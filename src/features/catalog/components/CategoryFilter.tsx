'use client'
import { cn } from '@/lib/utils'

const DEFAULT_CATEGORIES = ['All', 'Tours', 'Adventure', 'Culture', 'Food', 'Nature']

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
  categories?: string[]
  className?: string
}

export function CategoryFilter({ selected, onChange, categories, className }: CategoryFilterProps) {
  const cats = categories || DEFAULT_CATEGORIES

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {cats.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat === 'All' ? '' : cat)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            selected === cat || (cat === 'All' && selected === '')
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}