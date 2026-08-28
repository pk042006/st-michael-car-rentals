import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Review } from '../../types/database'
import { StarRating } from '../../components/common/StarRating'
import { formatDate } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<(Review & { users: { name: string } | null; vehicles: { name: string } | null })[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = () => {
    supabase.from('reviews').select('*, users(name), vehicles(name)').order('created_at', { ascending: false })
      .then(({ data }) => { setReviews(data as typeof reviews || []); setLoading(false) })
  }

  useEffect(() => { fetchReviews() }, [])

  const handleDelete = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
    toast.success('Review deleted')
  }

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-3xl font-bold text-gray-900">Customer Reviews</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No reviews yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reviews.map(r => (
              <div key={r.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] font-bold flex-shrink-0">
                  {r.users?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-gray-900">{r.users?.name || 'Anonymous'}</span>
                      <span className="text-gray-400 text-sm ml-2">on</span>
                      <span className="text-gray-700 text-sm ml-1">{r.vehicles?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors" aria-label="Delete review">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <StarRating rating={r.rating} size={14} />
                  {r.comment && <p className="text-sm text-gray-600 mt-1 leading-relaxed">"{r.comment}"</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
