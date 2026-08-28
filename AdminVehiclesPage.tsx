import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight, Crown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Vehicle } from '../../types/database'
import { Button } from '../../components/common/Button'
import { formatCurrency } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'
import { Badge } from '../../components/common/Badge'
import { Modal } from '../../components/common/Modal'
import toast from 'react-hot-toast'

export function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchVehicles = () => {
    supabase.from('vehicles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setVehicles(data || []); setLoading(false) })
  }

  useEffect(() => { fetchVehicles() }, [])

  const filtered = vehicles.filter(v =>
    !search || [v.name, v.brand, v.model, v.category].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  )

  const toggleAvailability = async (v: Vehicle) => {
    const { error } = await supabase.from('vehicles').update({ availability: !v.availability }).eq('id', v.id)
    if (error) { toast.error('Failed to update'); return }
    setVehicles(prev => prev.map(vehicle => vehicle.id === v.id ? { ...vehicle, availability: !vehicle.availability } : vehicle))
    toast.success(`${v.name} marked as ${!v.availability ? 'available' : 'unavailable'}`)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('vehicles').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) { toast.error('Cannot delete — may have active bookings'); setDeleteTarget(null); return }
    setVehicles(prev => prev.filter(v => v.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast.success('Vehicle deleted')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Vehicles</h1>
        <Link to="/admin/vehicles/new">
          <Button><Plus size={16} /> Add Vehicle</Button>
        </Link>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicles..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Price/Day</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(5)].map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No vehicles found</td></tr>
              ) : filtered.map(v => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={v.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&q=80'} alt={v.name} className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-1.5">
                          {v.name}
                          {v.is_premium && <Crown size={12} className="text-[#c9a84c]" />}
                        </div>
                        <div className="text-xs text-gray-400">{v.brand} {v.model} {v.year && `· ${v.year}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell"><Badge variant="gray">{v.category}</Badge></td>
                  <td className="px-4 py-3 hidden md:table-cell font-semibold text-[#c9a84c]">{formatCurrency(v.price_per_day)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleAvailability(v)} className="flex items-center gap-1.5 text-xs font-medium transition-colors" aria-label={`Toggle ${v.name} availability`}>
                      {v.availability ? (
                        <><ToggleRight size={18} className="text-green-500" /><span className="text-green-600">Available</span></>
                      ) : (
                        <><ToggleLeft size={18} className="text-gray-400" /><span className="text-gray-500">Unavailable</span></>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link to={`/admin/vehicles/${v.id}/edit`} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors" aria-label="Edit vehicle">
                        <Edit size={15} />
                      </Link>
                      <button onClick={() => setDeleteTarget(v)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" aria-label="Delete vehicle">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Vehicle" size="sm">
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-gray-700">Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Cancel</Button>
              <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
