import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Download, Car, MapPin, Calendar, User, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Booking, Vehicle } from '../types/database'
import { Button } from '../components/common/Button'
import { formatCurrency, formatDate } from '../lib/utils'
import { Badge } from '../components/common/Badge'

export function BookingConfirmationPage() {
  const { bookingRef } = useParams<{ bookingRef: string }>()
  const [booking, setBooking] = useState<Booking & { vehicles: Vehicle | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookingRef) return
    supabase.from('bookings').select('*, vehicles(*)').eq('booking_reference', bookingRef).single()
      .then(({ data }) => { setBooking(data as typeof booking); setLoading(false) })
  }, [bookingRef])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full" />
    </div>
  )

  if (!booking) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <AlertCircle size={48} className="text-red-400" />
      <h1 className="text-2xl font-bold text-gray-900">Booking Not Found</h1>
      <p className="text-gray-500">We couldn't find booking reference {bookingRef}.</p>
      <Link to="/"><Button>Return Home</Button></Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Booking Request Received!</h1>
          <p className="text-gray-600 text-lg">Thank you for choosing St Michael Car Rentals.</p>
          <p className="text-sm text-gray-500 mt-2">We've received your booking request and will confirm it shortly. Check your email for details.</p>
        </div>

        {/* Booking card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="bg-[#0a0a0a] p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Booking Reference</div>
              <div className="text-white font-mono font-bold text-2xl">{booking.booking_reference}</div>
            </div>
            <Badge variant="yellow">Pending Confirmation</Badge>
          </div>

          {booking.vehicles && (
            <div className="flex items-center gap-4 p-5 border-b border-gray-100">
              <img
                src={booking.vehicles.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80'}
                alt={booking.vehicles.name}
                className="w-24 h-16 object-cover rounded-xl flex-shrink-0"
              />
              <div>
                <div className="font-bold text-gray-900 text-lg">{booking.vehicles.name}</div>
                <div className="text-sm text-gray-500">{booking.vehicles.category} · {booking.vehicles.transmission}</div>
              </div>
            </div>
          )}

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">PICKUP</div>
                  <div className="font-semibold text-gray-900 text-sm">{formatDate(booking.pickup_date)}</div>
                  <div className="text-xs text-gray-500">at {booking.pickup_time}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">RETURN</div>
                  <div className="font-semibold text-gray-900 text-sm">{formatDate(booking.return_date)}</div>
                  <div className="text-xs text-gray-500">at {booking.return_time}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">PICKUP LOCATION</div>
                  <div className="font-semibold text-gray-900 text-sm">{booking.pickup_location}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User size={18} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">CUSTOMER</div>
                  <div className="font-semibold text-gray-900 text-sm">{booking.full_name}</div>
                  <div className="text-xs text-gray-500">{booking.phone}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <div className="text-gray-600 text-sm font-medium">Total Amount</div>
              <div className="text-2xl font-bold text-[#c9a84c]">{formatCurrency(booking.total || 0)}</div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
              Our team will contact you at <strong>{booking.email}</strong> / <strong>{booking.phone}</strong> to confirm your booking and arrange payment.
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/account/bookings" className="flex-1">
            <Button variant="outline" className="w-full">View My Bookings</Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button className="w-full">Return Home</Button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Contact us at <a href="tel:+233240000000" className="text-[#c9a84c]">+233 24 000 0000</a> or WhatsApp us.</p>
        </div>
      </div>
    </div>
  )
}
