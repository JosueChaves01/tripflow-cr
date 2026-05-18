import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface ListingGridProps<T> {
  items: T[]
  renderCard: (item: T) => ReactNode
  keyExtractor: (item: T) => string
  emptyMessage?: string
  className?: string
}

export function ListingGrid<T>({ items, renderCard, keyExtractor, emptyMessage = 'No results found', className }: ListingGridProps<T>) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {items.map((item) => (
        <div key={keyExtractor(item)}>{renderCard(item)}</div>
      ))}
    </div>
  )
}
