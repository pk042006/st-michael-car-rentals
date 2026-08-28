import { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { User } from '../../types/database'
import { formatCurrency } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<(User & { booking_count: number; total_spend: number; last_booking: string | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      supabase.from('users').select('*').eq('role', 'customer').order('created_at', { ascending: false }),
      supabase.from('bookings').select('user_id, total, created_at'),
    ]).then(([{ data: users }, { data: bookings }]) => {
      const enriched = (users || []).map(u => {
        const userBookings = (bookings || []).filter(b => b.user_id === u.id)
        return {
          ...u,
          booking_count: userBookings.length,
          total_spend: userBookings.reduce((sum, b) => sum + (b.total || 0), 0),
          last_booking: userBookings.length > 0 ? userBookings.sort((a, b) => b.created_at.localeCompare(a.created_at))[0].created_at : null,
        }
      })
      setCustomers(enriched)
      setLoading(false)
    })
  }, [])

  const filtered = customers.filter(c =>
    !search || [c.name, c.email, c.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-3xl font-bold text-gray-900">Customers</h1>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or phone..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Bookings</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Total Spend</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden xl:table-cell">Member Since</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(5)].map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No customers found</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] font-bold text-sm flex-shrink-0">
                        {c.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-700">{c.phone || '—'}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{c.booking_count}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-semibold text-[#c9a84c]">{formatCurrency(c.total_spend)}</td>
                  <td className="px-4 py-3 hidden xl:table-cell text-gray-500 text-xs">{new Date(c.created_at).toLocaleDateString('en-GH', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
