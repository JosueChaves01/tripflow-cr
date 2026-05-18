import { getHotels } from '@/features/catalog/actions'
import { HotelsClient } from './HotelsClient'

interface HotelsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const params = await searchParams
  const category = typeof params.category === 'string' ? params.category : ''
  const query = typeof params.query === 'string' ? params.query : ''
  const pageStr = typeof params.page === 'string' ? params.page : '1'
  const page = parseInt(pageStr, 10) || 1
  const limit = 12
  
  const { data: hotels, count } = await getHotels({ 
    category: category || undefined, 
    query: query || undefined, 
    page, 
    limit 
  })
  
  const totalPages = Math.ceil(count / limit) || 1

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <HotelsClient 
        initialHotels={hotels} 
        initialCategory={category} 
        initialQuery={query}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}
