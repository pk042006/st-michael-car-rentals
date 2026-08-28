import { useState, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Notification } from '../../types/database'
import { Button } from '../../components/common/Button'
import { formatDate } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'

export function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const fetchNotifications = () => {
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { setNotifications(data || []); setLoading(false) })
  }

  useEffect(() => { fetchNotifications() }, [])

  const markAllRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('All marked as read')
  }

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Notifications</h1>
        <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck size={15} /> Mark All Read</Button>
      </div>
      <div className="flex gap-2">
        {(['all', 'unread'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? 'bg-[#c9a84c] text-black' : 'bg-white border border-gray-200 text-gray-700'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center"><Bell size={40} className="text-gray-200 mx-auto mb-3" /><p className="text-gray-500">No notifications</p></div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(n => (
              <div
                key={n.id}
                className={`p-4 flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition-colors ${!n.read ? 'bg-[#c9a84c]/5' : ''}`}
                onClick={() => !n.read && markRead(n.id)}
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-[#c9a84c]' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <div className={`text-sm font-medium ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{n.message}</div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">{formatDate(n.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
