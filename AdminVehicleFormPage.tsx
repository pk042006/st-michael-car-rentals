import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Plus, X, Upload } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Vehicle } from '../../types/database'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Textarea } from '../../components/common/Textarea'
import { VEHICLE_CATEGORIES } from '../../lib/utils'
import toast from 'react-hot-toast'

export function AdminVehicleFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id && id !== 'new'
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([''])

  const [form, setForm] = useState({
    name: '', brand: '', model: '', year: '', category: 'Sedan' as Vehicle['category'],
    price_per_day: '', transmission: 'Automatic' as Vehicle['transmission'],
    fuel: 'Petrol' as Vehicle['fuel'], seats: '', doors: '', air_conditioning: true,
    luggage: '', description: '', availability: true, is_premium: false,
  })

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    supabase.from('vehicles').select('*').eq('id', id).single().then(({ data }) => {
      if (!data) { navigate('/admin/vehicles'); return }
      setForm({
        name: data.name, brand: data.brand, model: data.model,
        year: data.year?.toString() || '', category: data.category,
        price_per_day: data.price_per_day.toString(), transmission: data.transmission,
        fuel: data.fuel, seats: data.seats?.toString() || '',
        doors: data.doors?.toString() || '', air_conditioning: data.air_conditioning,
        luggage: data.luggage?.toString() || '', description: data.description || '',
        availability: data.availability, is_premium: data.is_premium,
      })
      setImageUrls(data.images?.length ? data.images : [''])
      setLoading(false)
    })
  }, [id, isEdit, navigate])

  const setField = (key: string, value: string | boolean) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.brand || !form.model || !form.price_per_day) {
      toast.error('Please fill in all required fields'); return
    }
    setSaving(true)
    const payload = {
      name: form.name, brand: form.brand, model: form.model,
      year: form.year ? parseInt(form.year) : null,
      category: form.category, price_per_day: parseFloat(form.price_per_day),
      transmission: form.transmission, fuel: form.fuel,
      seats: form.seats ? parseInt(form.seats) : null,
      doors: form.doors ? parseInt(form.doors) : null,
      air_conditioning: form.air_conditioning,
      luggage: form.luggage ? parseInt(form.luggage) : null,
      description: form.description || null,
      images: imageUrls.filter(u => u.trim()),
      availability: form.availability, is_premium: form.is_premium,
    }
    const { error } = isEdit
      ? await supabase.from('vehicles').update(payload).eq('id', id!)
      : await supabase.from('vehicles').insert(payload)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(isEdit ? 'Vehicle updated' : 'Vehicle added')
    navigate('/admin/vehicles')
  }

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-[#c9a84c] border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/vehicles" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ChevronLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="font-serif text-2xl font-bold text-gray-900">{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Vehicle Name" value={form.name} onChange={e => setField('name', e.target.value)} required placeholder="e.g. Toyota Fortuner 2023" />
            <Input label="Brand" value={form.brand} onChange={e => setField('brand', e.target.value)} required placeholder="e.g. Toyota" />
            <Input label="Model" value={form.model} onChange={e => setField('model', e.target.value)} required placeholder="e.g. Fortuner" />
            <Input label="Year" type="number" value={form.year} onChange={e => setField('year', e.target.value)} placeholder="e.g. 2023" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => setField('category', e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                {VEHICLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Price per Day (GH₵)" type="number" step="0.01" value={form.price_per_day} onChange={e => setField('price_per_day', e.target.value)} required placeholder="e.g. 350" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Transmission</label>
              <select value={form.transmission} onChange={e => setField('transmission', e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Fuel Type</label>
              <select value={form.fuel} onChange={e => setField('fuel', e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                {['Petrol','Diesel','Electric','Hybrid'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <Input label="Seats" type="number" value={form.seats} onChange={e => setField('seats', e.target.value)} placeholder="e.g. 5" />
            <Input label="Doors" type="number" value={form.doors} onChange={e => setField('doors', e.target.value)} placeholder="e.g. 4" />
            <Input label="Luggage Capacity" type="number" value={form.luggage} onChange={e => setField('luggage', e.target.value)} placeholder="e.g. 3" />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.air_conditioning} onChange={e => setField('air_conditioning', e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">Air Conditioning</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_premium} onChange={e => setField('is_premium', e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">Premium Vehicle</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.availability} onChange={e => setField('availability', e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">Available for Booking</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Images</h2>
          <p className="text-sm text-gray-500">Add image URLs (Unsplash, Cloudinary, Supabase Storage, etc.)</p>
          <div className="space-y-2">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url" value={url} placeholder="https://images.unsplash.com/..."
                  onChange={e => { const urls = [...imageUrls]; urls[i] = e.target.value; setImageUrls(urls) }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                />
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg" aria-label="Remove image">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} className="flex items-center gap-2 text-sm text-[#c9a84c] hover:underline font-medium">
            <Plus size={14} /> Add another image
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <Textarea label="Description" value={form.description} onChange={e => setField('description', e.target.value)} rows={4} placeholder="Brief description of this vehicle..." />
        </div>

        <div className="flex gap-3 justify-end">
          <Link to="/admin/vehicles"><Button variant="outline" type="button">Cancel</Button></Link>
          <Button type="submit" loading={saving}>{isEdit ? 'Save Changes' : 'Add Vehicle'}</Button>
        </div>
      </form>
    </div>
  )
}
