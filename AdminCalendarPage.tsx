import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { Modal } from '../../components/common/Modal'
import { getStatusColor } from '../../lib/utils'

type BookingRow = {
  id: string
  full_name: string
  booking_reference: string
  vehicle_id: string
  pickup_date: string
  return_date: string
  pickup_location: string
  status: string
  vehicles: { name: string } | null
}

export function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [vehicles, setVehicles] = useState<{id: string; name: string}[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('bookings').select('id, full_name, booking_reference, vehicle_id, pickup_date, return_date, pickup_location, status, vehicles(name)').in('status', ['pending','confirmed','active']),
      supabase.from('vehicles').select('id, name'),
    ]).then(([{ data: b }, { data: v }]) => {
      setBookings((b as unknown as BookingRow[]) || [])
      setVehicles(v || [])
      setLoading(false)
    })
  }, [])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const getBookingsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd')
    return bookings.filter(b => {
      if (selectedVehicle !== 'all' && b.vehicle_id !== selectedVehicle) return false
      return dayStr >= b.pickup_date && dayStr <= b.return_date
    })
  }

  const dayBookings = selectedDay ? getBookingsForDay(selectedDay) : []
  const startDayOfWeek = monthStart.getDay()

  const statusDotColor: Record<string, string> = {
    pending: 'bg-amber-400',
    confirmed: 'bg-blue-400',
    active: 'bg-green-500',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Booking Calendar</h1>
        <select
          value={selectedVehicle}
          onChange={e => setSelectedVehicle(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] bg-white"
        >
          <option value="all">All Vehicles</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Previous month"><ChevronLeft size={18} /></button>
          <h2 className="font-bold text-lg text-gray-900">{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Next month"><ChevronRight size={18} /></button>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-100">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="p-3 text-center text-xs font-semibold text-gray-500 uppercase">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`empty-${i}`} className="border-b border-r border-gray-50 h-20" />)}
          {daysInMonth.map(day => {
            const dayBookingsCount = getBookingsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isCurrentDay = isToday(day)
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(day)}
                className={`border-b border-r border-gray-100 h-20 p-2 text-left hover:bg-[#c9a84c]/5 transition-colors ${isCurrentDay ? 'bg-[#c9a84c]/10' : ''} ${!isCurrentMonth ? 'opacity-30' : ''}`}
              >
                <span className={`text-sm font-medium ${isCurrentDay ? 'text-[#c9a84c] font-bold' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
                {dayBookingsCount.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {dayBookingsCount.slice(0, 2).map(b => (
                      <div key={b.id} className={`w-full h-1.5 rounded-full ${statusDotColor[b.status] || 'bg-gray-300'}`} />
                    ))}
                    {dayBookingsCount.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayBookingsCount.length - 2} more</div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-4 flex-wrap">
          {[['Pending', 'bg-amber-400'], ['Confirmed', 'bg-blue-400'], ['Active', 'bg-green-500']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-2 text-xs text-gray-600">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!selectedDay} onClose={() => setSelectedDay(null)} title={selectedDay ? format(selectedDay, 'EEEE, MMMM d, yyyy') : ''}>
        {selectedDay && (
          dayBookings.length === 0 ? (
            <p className="text-gray-500 text-sm">No bookings on this day.</p>
          ) : (
            <div className="space-y-3">
              {dayBookings.map(b => (
                <div key={b.id} className="p-3 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{b.full_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getStatusColor(b.status)}`}>{b.status}</span>
                  </div>
                  <div className="text-xs text-gray-500">{b.vehicles?.name} · {b.pickup_location}</div>
                  <div className="text-xs text-gray-400 mt-0.5 font-mono">{b.booking_reference}</div>
                </div>
              ))}
            </div>
          )
        )}
      </Modal>
    </div>
  )
}
