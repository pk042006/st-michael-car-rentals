import { useState, useEffect } from 'react'
import { Car, BookOpen, DollarSign, CheckCircle, Clock, XCircle, AlertCircle, Activity } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Booking, Vehicle } from '../../types/database'
import { formatCurrency } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays, parseISO } from 'date-fns'

export function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('vehicles').select('*'),
    ]).then(([{ data: b }, { data: v }]) => { setBookings(b || []); setVehicles(v || []); setLoading(false) })
  }, [])

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    vehicles: vehicles.length,
    available: vehicles.filter(v => v.availability).length,
    revenue: bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.total || 0), 0),
  }

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = format(subDays(new Date(), 13 - i), 'yyyy-MM-dd')
    return { date: format(parseISO(date), 'MMM d'), count: bookings.filter(b => b.created_at.startsWith(date)).length }
  })

  const statusData = [
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Confirmed', value: stats.confirmed, color: '#3b82f6' },
    { name: 'Active', value: stats.active, color: '#22c55e' },
    { name: 'Completed', value: stats.completed, color: '#6b7280' },
    { name: 'Cancelled', value: stats.cancelled, color: '#ef4444' },
  ].filter(d => d.value > 0)

  const revenueData = Array.from({ length: 6 }, (_, i) => {
    const date = subDays(new Date(), (5 - i) * 30)
    return { month: format(date, 'MMM'), revenue: bookings.filter(b => b.payment_status === 'paid' && b.created_at.startsWith(format(date, 'yyyy-MM'))).reduce((sum, b) => sum + (b.total || 0), 0) }
  })

  const StatCard = ({ label, value, icon: Icon, color, sub }: { label: string; value: string | number; icon: any; color: string; sub?: string }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={20} /></div>
      {loading ? <Skeleton className="h-8 w-20 mb-1" /> : <div className="text-2xl font-bold text-gray-900">{value}</div>}
      <div className="text-sm text-gray-500">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )

  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-3xl font-bold text-gray-900">Dashboard</h1><p className="text-gray-500 text-sm mt-1">Overview of St Michael Car Rentals operations</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard label="Total Bookings" value={stats.total} icon={BookOpen} color="bg-blue-50 text-blue-600" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" />
        <StatCard label="Active Rentals" value={stats.active} icon={Activity} color="bg-green-50 text-green-600" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="bg-gray-100 text-gray-600" />
        <StatCard label="Revenue (Paid)" value={formatCurrency(stats.revenue)} icon={DollarSign} color="bg-[#c9a84c]/10 text-[#c9a84c]" />
        <StatCard label="Vehicles" value={stats.vehicles} icon={Car} color="bg-purple-50 text-purple-600" sub={`${stats.available} available`} />
        <StatCard label="Cancelled" value={stats.cancelled} icon={XCircle} color="bg-red-50 text-red-500" />
        <StatCard label="Confirmed" value={stats.confirmed} icon={AlertCircle} color="bg-indigo-50 text-indigo-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Bookings (Last 14 Days)</h2>
          <ResponsiveContainer width="100%" height={200}><LineChart data={last14Days}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="count" stroke="#c9a84c" strokeWidth={2} dot={{ fill: '#c9a84c', r: 4 }} /></LineChart></ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Status Breakdown</h2>
          {statusData.length > 0 ? <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{statusData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer> : <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No booking data yet</div>}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={200}><BarChart data={revenueData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₵${v}`} /><Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} /><Bar dataKey="revenue" fill="#c9a84c" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          {loading ? <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div> : bookings.slice(0, 6).map(b => (
            <div key={b.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div><div className="text-sm font-medium text-gray-900">{b.full_name}</div><div className="text-xs text-gray-400 font-mono">{b.booking_reference}</div></div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : b.status === 'pending' ? 'bg-amber-100 text-amber-700' : b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{b.status}</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(b.total || 0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}