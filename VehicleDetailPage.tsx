import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Fuel, Settings, Users, Wind, Briefcase, Star, Crown, ChevronLeft, ChevronRight, Check, Shield, Calendar, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Vehicle, Review } from '../types/database'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { StarRating } from '../components/common/StarRating'
import { Skeleton } from '../components/common/Skeleton'
import { formatCurrency, formatDate } from '../lib/utils'

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [reviews, setReviews] = useState<(Review & { users: { name: string } | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [imgIndex, setImgIndex] = useState(0)
  const [avgRating, setAvgRating] = useState(0)

  useEffect(() => {
    if (!id) return
    Promise.all([
      supabase.from('vehicles').select('*').eq('id', id).single(),
      supabase.from('reviews').select('*, users(name)').eq('vehicle_id', id).order('created_at', { ascending: false }),
    ]).then(([{ data: v }, { data: r }]) => {
      if (!v) { navigate('/cars'); return }
      setVehicle(v)
      const revData = r as typeof reviews || []
      setReviews(revData)
      if (revData.length > 0) {
        setAvgRating(revData.reduce((sum, r) => sum + r.rating, 0) / revData.length)
      }
      setLoading(false)
    })
  }, [id, navigate])

  if (loading) return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <Skeleton className="h-96 w-full rounded-2xl mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  )

  if (!vehicle) return null

  const images = vehicle.images?.length ? vehicle.images : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80']

  const specs = [
    { label: 'Brand', value: vehicle.brand },
    { label: 'Model', value: vehicle.model },
    { label: 'Year', value: vehicle.year?.toString() },
    { label: 'Category', value: vehicle.category },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Fuel Type', value: vehicle.fuel },
    { label: 'Seats', value: vehicle.seats ? `${vehicle.seats} Seats` : undefined },
    { label: 'Doors', value: vehicle.doors ? `${vehicle.doors} Doors` : undefined },
    { label: 'Luggage', value: vehicle.luggage ? `${vehicle.luggage} Bags` : undefined },
    { label: 'Air Conditioning', value: vehicle.air_conditioning ? 'Yes' : 'No' },
  ].filter(s => s.value)

  const features = [
    'Comprehensive insurance included',
    'Unlimited mileage (standard package)',
    'Airport pickup available',
    '24/7 roadside assistance',
    'Clean & sanitized vehicle',
    'Free cancellation (24h notice)',
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cars" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to Fleet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-72 sm:h-96">
                <img src={images[imgIndex]} alt={vehicle.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {vehicle.is_premium && <Badge variant="gold" className="flex items-center gap-1"><Crown size={10} /> Premium</Badge>}
                  <Badge variant={vehicle.availability ? 'green' : 'red'}>{vehicle.availability ? 'Available' : 'Unavailable'}</Badge>
                </div>
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIndex((imgIndex - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors" aria-label="Previous image"><ChevronLeft size={18} /></button>
                    <button onClick={() => setImgIndex((imgIndex + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors" aria-label="Next image"><ChevronRight size={18} /></button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIndex(i)} className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-[#c9a84c]' : 'border-transparent'}`}>
                      <img src={img} alt={`View ${i+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-gray-900">{vehicle.name}</h1>
                  <p className="text-gray-500 mt-1">{vehicle.brand} {vehicle.model} {vehicle.year && `· ${vehicle.year}`}</p>
                </div>
                {reviews.length > 0 && (
                  <div className="text-right">
                    <StarRating rating={Math.round(avgRating)} size={18} />
                    <p className="text-sm text-gray-500 mt-1">{avgRating.toFixed(1)} ({reviews.length} reviews)</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { icon: Settings, label: vehicle.transmission },
                  { icon: Fuel, label: vehicle.fuel },
                  { icon: Users, label: `${vehicle.seats} Seats` },
                  { icon: Wind, label: vehicle.air_conditioning ? 'A/C' : 'No A/C' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl">
                    <item.icon size={18} className="text-[#c9a84c]" />
                    <span className="text-xs text-gray-700 text-center">{item.label}</span>
                  </div>
                ))}
              </div>

              {vehicle.description && (
                <div className="mb-5">
                  <h2 className="font-semibold text-gray-900 mb-2">About This Vehicle</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Specs */}
              <div className="mb-5">
                <h2 className="font-semibold text-gray-900 mb-3">Specifications</h2>
                <div className="grid grid-cols-2 gap-2">
                  {specs.map(s => (
                    <div key={s.label} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">{s.label}</span>
                      <span className="text-sm font-medium text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included features */}
              <div className="mb-5">
                <h2 className="font-semibold text-gray-900 mb-3">What's Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={14} className="text-green-500 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rental requirements */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><AlertCircle size={16} className="text-amber-600" /> Rental Requirements</h2>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Minimum driver age: 21 years</li>
                  <li>• Valid driver's license required</li>
                  <li>• Refundable deposit: GH₵500</li>
                  <li>• Security deposit held at pickup</li>
                </ul>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 text-xl mb-5">Customer Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this vehicle!</p>
              ) : (
                <div className="space-y-5">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{review.users?.name || 'Anonymous'}</div>
                        <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                      {review.comment && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(vehicle.price_per_day)}</div>
              <div className="text-gray-500 text-sm mb-5">per day</div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Shield size={15} className="text-green-500" /> Comprehensive insurance included
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar size={15} className="text-green-500" /> Free cancellation (24h notice)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check size={15} className="text-green-500" /> Instant confirmation
                </div>
              </div>

              {vehicle.availability ? (
                <Link to={`/booking/${vehicle.id}`}>
                  <Button size="lg" className="w-full">Reserve This Car</Button>
                </Link>
              ) : (
                <Button size="lg" className="w-full" disabled>Currently Unavailable</Button>
              )}

              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 text-center">GH₵500 refundable deposit required at pickup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
