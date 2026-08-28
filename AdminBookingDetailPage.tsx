import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Save } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Booking, Vehicle } from '../../types/database'
import { Button } from '../../components/common/Button'
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'

const STATUS_ACTIONS = [
  { status: 'confirmed', label: 'Confirm', color: 'bg-blue-500 hover:bg-blue-600 text-white' },
  { status: 'rejected', label: 'Reject', color: 'bg-red-500 hover:bg-red-600 text-white' },
  { status: 'active', label: 'Mark Active', color: 'bg-green-500 hover:bg-green-600 text-white' },
  { status: 'completed', label: 'Mark Completed', color: 'bg-gray-600 hover:bg-gray-700 text-white' },
  { status: 'cancelled', label: 'Cancel', color: 'bg-red-400 hover:bg-red-500 text-white' },
]

export function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<(Booking & { vehicles: Vehicle | null }) | null>(null)
  const [extras, setExtras] = useState<{ extra_name: string; price: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([
      supabase.from('bookings').select('*, vehicles(*)').eq('id', id).single(),
      supabase.from('booking_extras').select('extra_name, price').eq('booking_id', id),
    ]).then(([{ data: b }, { data: e }]) => {
      if (!b) { navigate('/admin/bookings'); return }
      setBooking(b as typeof booking)
      setAdminNotes(b.admin_notes || '')
      setPaymentStatus(b.payment_status)
      setExtras(e || [])
      setLoading(false)
    })
  }, [id, navigate])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!booking) return
    setUpdating(true)
    const { error } = await supabase.from('bookings').update({ status: newStatus, admin_notes: adminNotes, payment_status: paymentStatus }).eq('id', booking.id)
    setUpdating(false)
    if (error) { toast.error('Failed to update'); return }
    setBooking(b => b ? { ...b, status: newStatus as Booking['status'] } : b)
    toast.success(`Booking ${newStatus}`)
  }

  const handleSaveNotes = async () => {
    if (!booking) return
    setUpdating(true)
    const { error } = await supabase.from('bookings').update({ admin_notes: adminNotes, payment_status: paymentStatus }).eq('id', booking.id)
    setUpdating(false)
    if (error) { toast.error('Failed to save'); return }
    toast.success('Notes saved')
  }

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-2 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
    </div>
  )

  if (!booking) return null

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/bookings" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ChevronLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Booking {booking.booking_reference}</h1>
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>{booking.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Vehicle */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Vehicle</h2>
          {booking.vehicles && (
            <div>
              <img src={booking.vehicles.images?.[0] || ''} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />
              <div className="font-bold text-gray-900">{booking.vehicles.name}</div>
              <div className="text-sm text-gray-500">{booking.vehicles.category} · {booking.vehicles.transmission}</div>
              <div className="text-lg font-bold text-[#c9a84c] mt-1">{formatCurrency(booking.vehicles.price_per_day)}/day</div>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Customer</h2>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium">{booking.full_name}</span></div>
            <div><span className="text-gray-500">Email:</span> <a href={`mailto:${booking.email}`} className="font-medium text-[#c9a84c]">{booking.email}</a></div>
            <div><span className="text-gray-500">Phone:</span> <a href={`tel:${booking.phone}`} className="font-medium">{booking.phone}</a></div>
            {booking.country && <div><span className="text-gray-500">Country:</span> <span className="font-medium">{booking.country}</span></div>}
            {booking.company_name && <div><span className="text-gray-500">Company:</span> <span className="font-medium">{booking.company_name}</span></div>}
            <div><span className="text-gray-500">Driver Age:</span> <span className="font-medium">{booking.driver_age} yrs</span></div>
            <div><span className="text-gray-500">License:</span> <span className="font-medium capitalize">{booking.driver_license_status?.replace('_', ' ')}</span></div>
            {booking.additional_driver && (
              <div><span className="text-gray-500">Add. Driver:</span> <span className="font-medium">{booking.additional_driver_name}</span></div>
            )}
          </div>
        </div>

        {/* Rental Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Rental Details</h2>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-500">Pickup:</span> <div className="font-medium">{formatDate(booking.pickup_date)} at {booking.pickup_time}</div></div>
            <div><span className="text-gray-500">Return:</span> <div className="font-medium">{formatDate(booking.return_date)} at {booking.return_time}</div></div>
            <div><span className="text-gray-500">Pickup Loc:</span> <div className="font-medium">{booking.pickup_location}</div></div>
            <div><span className="text-gray-500">Return Loc:</span> <div className="font-medium">{booking.return_location}</div></div>
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Payment Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
          <div><span className="text-gray-500 block">Subtotal</span><span className="font-bold">{formatCurrency(booking.subtotal || 0)}</span></div>
          <div><span className="text-gray-500 block">Extras</span><span className="font-bold">{formatCurrency(booking.extras_total)}</span></div>
          <div><span className="text-gray-500 block">Taxes</span><span className="font-bold">{formatCurrency(booking.taxes || 0)}</span></div>
          <div><span className="text-gray-500 block">Service Fee</span><span className="font-bold">{formatCurrency(booking.service_fee || 0)}</span></div>
          {booking.discount > 0 && <div><span className="text-gray-500 block">Discount</span><span className="font-bold text-green-600">-{formatCurrency(booking.discount)}</span></div>}
          <div className="sm:col-span-4"><span className="text-gray-700 font-medium block">Total</span><span className="font-bold text-xl text-[#c9a84c]">{formatCurrency(booking.total || 0)}</span></div>
        </div>
        {extras.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Extras Selected:</div>
            <div className="space-y-1">
              {extras.map((e, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{e.extra_name}</span>
                  <span className="font-medium">{formatCurrency(e.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Payment Status:</label>
          <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
            {['unpaid','pending','paid','refunded'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Admin Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Admin Notes</h2>
        <textarea
          value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none"
          rows={3} placeholder="Internal notes visible only to admin..."
        />
        {booking.notes && (
          <div className="mt-3 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
            <span className="font-medium">Customer notes: </span>{booking.notes}
          </div>
        )}
        <Button onClick={handleSaveNotes} loading={updating} variant="outline" size="sm" className="mt-3">
          <Save size={14} /> Save Notes
        </Button>
      </div>

      {/* Status Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_ACTIONS.filter(a => a.status !== booking.status).map(action => (
            <button
              key={action.status}
              onClick={() => handleStatusUpdate(action.status)}
              disabled={updating}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${action.color}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
