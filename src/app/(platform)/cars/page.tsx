import { getCars } from '@/features/catalog/cars'
import { CarsClient } from './CarsClient'

interface CarsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams
  const query = typeof params.query === 'string' ? params.query : ''
  const pageStr = typeof params.page === 'string' ? params.page : '1'
  const page = parseInt(pageStr, 10) || 1
  const limit = 12

  const { data: cars, count } = await getCars({
    query: query || undefined,
    page,
    limit,
  })

  const totalPages = Math.ceil(count / limit) || 1

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <CarsClient
        initialCars={cars}
        initialQuery={query}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}
