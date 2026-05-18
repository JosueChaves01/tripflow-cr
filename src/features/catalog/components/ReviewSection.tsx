import { Star } from 'lucide-react'

interface ReviewData {
  id: string
  rating: number
  comment?: string | null
  user?: { full_name?: string | null } | null
}

interface ReviewSectionProps {
  reviews: ReviewData[]
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  if (reviews.length === 0) return null

  return (
    <section className="pt-10 border-t border-slate-100">
      <h3 className="text-3xl font-semibold text-slate-900 mb-8">Reseñas ({reviews.length})</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                {review.user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{review.user?.full_name || 'Usuario Anónimo'}</p>
                <div className="flex items-center gap-1 text-yellow-400 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400' : 'text-slate-300'} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-slate-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
