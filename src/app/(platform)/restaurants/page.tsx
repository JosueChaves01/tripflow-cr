import { getRestaurants } from '@/features/catalog/actions'
import { RestaurantsClient } from './RestaurantsClient'

interface RestaurantsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const params = await searchParams
  const category = typeof params.category === 'string' ? params.category : ''
  const query = typeof params.query === 'string' ? params.query : ''
  const pageStr = typeof params.page === 'string' ? params.page : '1'
  const page = parseInt(pageStr, 10) || 1
  const limit = 12
  
  const { data: restaurants, count } = await getRestaurants({ 
    category: category || undefined, 
    query: query || undefined, 
    page, 
    limit 
  })
  
  const totalPages = Math.ceil(count / limit) || 1

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <RestaurantsClient 
        initialRestaurants={restaurants} 
        initialCategory={category} 
        initialQuery={query}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}
