import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Booking, Review, Vehicle } from '../../types/database'
import { StarRating } from '../../components/common/StarRating'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { Textarea } from '../../components/common/Textarea'
import { formatDate } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'

export function MyReviewsPage() {
  const { supabaseUser } = useAuth()
  const [completedBookings, setCompletedBookings] = useState<(Booking & { vehicles: Vehicle | null })[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState<(Booking & { vehicles: Vehicle | null }) | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = () => {
    if (!supabaseUser) return
    Promise.all([
      supabase.from('bookings').select('*, vehicles(*)').eq('user_id', supabaseUser.id).eq('status', 'completed'),
      supabase.from('reviews').select('*').eq('user_id', supabaseUser.id),
    ]).then(([{ data: b }, { data: r }]) => {
      setCompletedBookings(b as typeof completedBookings || [])
      setReviews(r || [])
      setLoading(false)
    })
  }

  useEffect(() => { fetchData() }, [supabaseUser])

  const reviewedBookingIds = new Set(reviews.map(r => r.booking_id))

  const handleSubmitReview = async () => {
    if (!reviewing || !supabaseUser) return
    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert({
      user_id: supabaseUser.id,
      vehicle_id: reviewing.vehicle_id,
      booking_id: reviewing.id,
      rating,
      comment: comment.trim() || null,
    })
    setSubmitting(false)
    if (error) { toast.error('Failed to submit review'); return }
    toast.success('Review submitted! Thank you.')
    setReviewing(null)
    setRating(5)
    setComment('')
    fetchData()
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold text-gray-900">My Reviews</h1>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
      ) : completedBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500">Complete a rental to leave a review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Completed Rentals</h2>
          {completedBookings.map(b => {
            const reviewed = reviewedBookingIds.has(b.id)
            const review = reviews.find(r => r.booking_id === b.id)
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <img src={b.vehicles?.images?.[0] || ''} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{b.vehicles?.name}</div>
                  <div className="text-sm text-gray-500">{formatDate(b.pickup_date)} — {b.booking_reference}</div>
                  {reviewed && review && <StarRating rating={review.rating} size={14} />}
                  {reviewed && review?.comment && <p className="text-sm text-gray-600 mt-1 italic">"{review.comment}"</p>}
                </div>
                {!reviewed && (
                  <Button size="sm" onClick={() => setReviewing(b)}>Leave Review</Button>
                )}
                {reviewed && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Reviewed</span>}
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!reviewing} onClose={() => setReviewing(null)} title="Leave a Review">
        {reviewing && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img src={reviewing.vehicles?.images?.[0] || ''} alt="" className="w-14 h-10 object-cover rounded-lg" />
              <div>
                <div className="font-bold text-gray-900">{reviewing.vehicles?.name}</div>
                <div className="text-sm text-gray-500">{formatDate(reviewing.pickup_date)}</div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Your Rating</label>
              <StarRating rating={rating} size={32} interactive onChange={setRating} />
            </div>
            <Textarea label="Your Review (optional)" value={comment} onChange={e => setComment(e.target.value)} placeholder="Tell us about your experience..." rows={4} />
            <Button onClick={handleSubmitReview} loading={submitting} className="w-full">Submit Review</Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
