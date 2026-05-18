'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { CategoryFilter } from '@/features/catalog/components/CategoryFilter'
import { ListingGrid } from '@/features/catalog/components/ListingGrid'
import { RestaurantCard } from '@/features/catalog/components/RestaurantCard'
import { Input } from '@/components/ui/Input'
import type { Restaurant } from '@/types'

const RESTAURANT_CATEGORIES = ['All', 'Fine Dining', 'Casual', 'Seafood', 'Café', 'Fusion', 'Vegetarian']

interface RestaurantsClientProps {
  initialRestaurants: Restaurant[]
  initialCategory: string
  initialQuery: string
  currentPage: number
  totalPages: number
}

export function RestaurantsClient({ 
  initialRestaurants, 
  initialCategory,
  initialQuery,
  currentPage,
  totalPages
}: RestaurantsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [search, setSearch] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (search === initialQuery) return
    
    const handler = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams()
        if (initialCategory) params.set('category', initialCategory)
        if (search) params.set('query', search)
        params.set('page', '1')
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, 300)

    return () => clearTimeout(handler)
  }, [search, initialCategory, pathname, router, initialQuery])

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (search) params.set('query', search)
      params.set('page', '1')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (initialCategory) params.set('category', initialCategory)
      if (search) params.set('query', search)
      params.set('page', newPage.toString())
      router.replace(`${pathname}?${params.toString()}`, { scroll: true })
    })
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-3xl font-bold text-slate-800">Discover Great Places to Eat</h1>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <CategoryFilter 
          selected={initialCategory} 
          onChange={handleCategoryChange} 
          categories={RESTAURANT_CATEGORIES}
        />
      </div>
      
      {isPending ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      ) : (
        <div className="transition-opacity duration-200">
          <ListingGrid
            items={initialRestaurants}
            renderCard={(restaurant) => <RestaurantCard restaurant={restaurant} />}
            keyExtractor={(restaurant) => restaurant.id}
            emptyMessage="No restaurants found"
          />
          
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-white border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-white border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
