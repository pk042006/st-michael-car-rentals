import { useState, useEffect } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PromoCode } from '../../types/database'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { formatCurrency } from '../../lib/utils'
import { Skeleton } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'

export function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', start_date: '', end_date: '', usage_limit: '', minimum_amount: '' })

  const fetchCodes = () => {
    supabase.from('promo_codes').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setCodes(data || []); setLoading(false) })
  }
  useEffect(() => { fetchCodes() }, [])

  const setField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.discount_value) { toast.error('Code and discount value required'); return }
    setSaving(true)
    const { error } = await supabase.from('promo_codes').insert({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type as 'percentage' | 'fixed',
      discount_value: parseFloat(form.discount_value),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
      minimum_amount: form.minimum_amount ? parseFloat(form.minimum_amount) : 0,
      active: true,
    })
    setSaving(false)
    if (error) { toast.error(error.message.includes('unique') ? 'Code already exists' : error.message); return }
    toast.success('Promo code created')
    setShowForm(false)
    setForm({ code: '', discount_type: 'percentage', discount_value: '', start_date: '', end_date: '', usage_limit: '', minimum_amount: '' })
    fetchCodes()
  }

  const toggleActive = async (c: PromoCode) => {
    await supabase.from('promo_codes').update({ active: !c.active }).eq('id', c.id)
    setCodes(prev => prev.map(p => p.id === c.id ? { ...p, active: !p.active } : p))
    toast.success(`${c.code} ${!c.active ? 'activated' : 'deactivated'}`)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('promo_codes').delete().eq('id', id)
    setCodes(prev => prev.filter(c => c.id !== id))
    toast.success('Promo code deleted')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Promo Codes</h1>
        <Button onClick={() => setShowForm(true)}><Plus size={16} /> Create Code</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Discount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Usage</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Valid Until</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}
                  </tr>
                ))
              ) : codes.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No promo codes yet</td></tr>
              ) : codes.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">{c.code}</td>
                  <td className="px-4 py-3 font-semibold text-[#c9a84c]">
                    {c.discount_type === 'percentage' ? `${c.discount_value}%` : formatCurrency(c.discount_value)}
                    {c.minimum_amount > 0 && <div className="text-xs text-gray-400">Min: {formatCurrency(c.minimum_amount)}</div>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-600">
                    {c.used_count}{c.usage_limit ? `/${c.usage_limit}` : ''} used
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">
                    {c.end_date ? new Date(c.end_date).toLocaleDateString('en-GH') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(c)} className="flex items-center gap-1 text-xs font-medium" aria-label={`Toggle ${c.code}`}>
                      {c.active ? <><ToggleRight size={18} className="text-green-500" /><span className="text-green-600">Active</span></> : <><ToggleLeft size={18} className="text-gray-400" /><span className="text-gray-500">Inactive</span></>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors" aria-label={`Delete ${c.code}`}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create Promo Code">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Code" value={form.code} onChange={e => setField('code', e.target.value.toUpperCase())} required placeholder="e.g. WELCOME20" />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select value={form.discount_type} onChange={e => setField('discount_type', e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (GH₵)</option>
              </select>
            </div>
            <Input label="Value" type="number" step="0.01" value={form.discount_value} onChange={e => setField('discount_value', e.target.value)} required placeholder={form.discount_type === 'percentage' ? '20' : '50'} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" value={form.start_date} onChange={e => setField('start_date', e.target.value)} />
            <Input label="End Date" type="date" value={form.end_date} onChange={e => setField('end_date', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Usage Limit (optional)" type="number" value={form.usage_limit} onChange={e => setField('usage_limit', e.target.value)} placeholder="e.g. 100" />
            <Input label="Minimum Amount (GH₵)" type="number" value={form.minimum_amount} onChange={e => setField('minimum_amount', e.target.value)} placeholder="0" />
          </div>
          <Button type="submit" loading={saving} className="w-full">Create Promo Code</Button>
        </form>
      </Modal>
    </div>
  )
}
