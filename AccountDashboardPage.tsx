import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Clock, CheckCircle, Bell, User, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Booking, Notification } from '../../types/database'
import { Badge } from '../../components/common/Badge'
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'

export function AccountDashboardPage() {
  const { supabaseUser, dbUser } = useAuth()
  const [bookings, setBookings] = useState<(Booking & { vehicles: { name: string; images: string[] } | null })[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseUser) return
    Promise.all([
      supabase.from('bookings').select('*, vehicles(name, images)').eq('user_id', supabaseUser.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('notifications').select('*').eq('user_id', supabaseUser.id).order('created_at', { ascending: false }).limit(5),
    ]).then(([{ data: b }, { data: n }]) => {
      setBookings(b as typeof bookings || [])
      setNotifications(n || [])
      setLoading(false)
    })
  }, [supabaseUser])

  const upcoming = bookings.filter(b => ['pending','confirmed','active'].includes(b.status))
  const completed = bookings.filter(b => b.status === 'completed')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Welcome back, {dbUser?.name?.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: Car, color: 'bg-blue-50 text-blue-600' },
          { label: 'Upcoming', value: upcoming.length, icon: Clock, color: 'bg-amber-50 text-amber-600' },
          { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '—' : stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
          <Link to="/account/bookings" className="text-sm text-[#c9a84c] hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center">
            <Car size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">No bookings yet</p>
            <Link to="/cars" className="text-[#c9a84c] font-semibold hover:underline">Browse our fleet</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {bookings.map(b => (
              <div key={b.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <img src={b.vehicles?.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&q=80'} alt={b.vehicles?.name} className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm truncate">{b.vehicles?.name || 'Vehicle'}</div>
                  <div className="text-xs text-gray-500">{b.booking_reference} · {formatDate(b.pickup_date)}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(b.status)}`}>{b.status}</span>
                  <span className="font-bold text-sm text-gray-900">{formatCurrency(b.total || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Bell size={18} className="text-[#c9a84c]" />
            <h2 className="font-semibold text-gray-900">Recent Notifications</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {notifications.map(n => (
              <div key={n.id} className={`p-4 ${!n.read ? 'bg-amber-50/30' : ''}`}>
                <div className="font-medium text-gray-900 text-sm">{n.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{n.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
