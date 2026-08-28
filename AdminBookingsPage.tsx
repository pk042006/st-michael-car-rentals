import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Eye } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Booking } from '../../types/database'
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'
import { Badge } from '../../components/common/Badge'

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<(Booking & { vehicles: { name: string } | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    supabase.from('bookings').select('*, vehicles(name)').order('created_at', { ascending: false })
      .then(({ data }) => { setBookings(data as typeof bookings || []); setLoading(false) })
  }, [])

  const filtered = bookings.filter(b => {
    const matchesSearch = !search || [b.booking_reference, b.full_name, b.email, b.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statuses = ['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected']

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-3xl font-bold text-gray-900">All Bookings</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ref, name, email, phone..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white">
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Reference</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Pickup</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Total</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">No bookings found</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{b.booking_reference}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{b.full_name}</div>
                    <div className="text-xs text-gray-400">{b.email}</div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-700">{b.vehicles?.name || '—'}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{formatDate(b.pickup_date)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(b.status)}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-semibold text-gray-900">{formatCurrency(b.total || 0)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/bookings/${b.id}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors inline-flex" title="View details">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
