import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Booking, Vehicle } from '../../types/database'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Modal } from '../../components/common/Modal'
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'

export function MyBookingsPage() {
  const { supabaseUser } = useAuth()
  const [bookings, setBookings] = useState<(Booking & { vehicles: Vehicle | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<(Booking & { vehicles: Vehicle | null }) | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const fetchBookings = () => {
    if (!supabaseUser) return
    supabase.from('bookings').select('*, vehicles(*)').eq('user_id', supabaseUser.id).order('created_at', { ascending: false })
      .then(({ data }) => { setBookings(data as typeof bookings || []); setLoading(false) })
  }

  useEffect(() => { fetchBookings() }, [supabaseUser])

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const handleCancel = async (bookingId: string) => {
    setCancelling(true)
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
    setCancelling(false)
    if (error) { toast.error('Failed to cancel booking'); return }
    toast.success('Booking cancelled successfully')
    setSelected(null)
    fetchBookings()
  }

  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold text-gray-900">My Bookings</h1>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.value ? 'bg-[#c9a84c] text-black' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#c9a84c]'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Car size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No {filter === 'all' ? '' : filter} bookings found</p>
          <Link to="/cars"><Button>Browse Cars</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                <img
                  src={b.vehicles?.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80'}
                  alt={b.vehicles?.name}
                  className="sm:w-40 h-32 sm:h-auto object-cover flex-shrink-0"
                />
                <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(b.status)}`}>{b.status}</span>
                      <span className="text-xs text-gray-400 font-mono">{b.booking_reference}</span>
                    </div>
                    <div className="font-bold text-gray-900 text-lg">{b.vehicles?.name || 'Vehicle'}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {formatDate(b.pickup_date)} → {formatDate(b.return_date)}
                    </div>
                    <div className="text-sm text-gray-500">{b.pickup_location}</div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-xl font-bold text-[#c9a84c]">{formatCurrency(b.total || 0)}</div>
                    <Button variant="outline" size="sm" onClick={() => setSelected(b)}>View Details</Button>
                    {b.status === 'pending' && (
                      <Button variant="danger" size="sm" onClick={() => handleCancel(b.id)} loading={cancelling}>Cancel</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Booking Details" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <img src={selected.vehicles?.images?.[0] || ''} alt="" className="w-20 h-14 object-cover rounded-xl" />
              <div>
                <div className="font-bold text-lg text-gray-900">{selected.vehicles?.name}</div>
                <div className="text-gray-500 text-sm font-mono">{selected.booking_reference}</div>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(selected.status)}`}>{selected.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Pickup Date:</span><div className="font-medium">{formatDate(selected.pickup_date)} at {selected.pickup_time}</div></div>
              <div><span className="text-gray-500">Return Date:</span><div className="font-medium">{formatDate(selected.return_date)} at {selected.return_time}</div></div>
              <div><span className="text-gray-500">Pickup Location:</span><div className="font-medium">{selected.pickup_location}</div></div>
              <div><span className="text-gray-500">Return Location:</span><div className="font-medium">{selected.return_location}</div></div>
              <div><span className="text-gray-500">Subtotal:</span><div className="font-medium">{formatCurrency(selected.subtotal || 0)}</div></div>
              <div><span className="text-gray-500">Extras:</span><div className="font-medium">{formatCurrency(selected.extras_total)}</div></div>
              <div><span className="text-gray-500">Taxes:</span><div className="font-medium">{formatCurrency(selected.taxes || 0)}</div></div>
              <div><span className="text-gray-500">Total:</span><div className="font-bold text-[#c9a84c]">{formatCurrency(selected.total || 0)}</div></div>
              <div><span className="text-gray-500">Payment:</span><div className={`font-medium capitalize ${getStatusColor(selected.payment_status)}`}>{selected.payment_status}</div></div>
            </div>
            {selected.notes && <div className="bg-gray-50 rounded-xl p-3 text-sm"><span className="font-medium text-gray-700">Notes: </span>{selected.notes}</div>}
            {selected.status === 'pending' && (
              <Button variant="danger" onClick={() => handleCancel(selected.id)} loading={cancelling} className="w-full">
                Cancel This Booking
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
