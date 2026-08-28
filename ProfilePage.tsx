import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const { dbUser, refreshUser } = useAuth()
  const [form, setForm] = useState({
    name: dbUser?.name || '',
    phone: dbUser?.phone || '',
    country: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dbUser) return
    setLoading(true)
    const { error } = await supabase.from('users').update({ name: form.name, phone: form.phone }).eq('id', dbUser.id)
    setLoading(false)
    if (error) { toast.error('Failed to update profile'); return }
    await refreshUser()
    toast.success('Profile updated successfully')
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-serif text-3xl font-bold text-gray-900">My Profile</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-[#c9a84c] flex items-center justify-center text-2xl font-bold text-black">
            {dbUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">{dbUser?.name}</div>
            <div className="text-sm text-gray-500">{dbUser?.email}</div>
            <div className="text-xs text-[#c9a84c] capitalize font-medium mt-0.5">{dbUser?.role}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
            <input value={dbUser?.email || ''} disabled className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+233 XX XXX XXXX" />
          <Button type="submit" loading={loading} className="w-full sm:w-auto">Save Changes</Button>
        </form>
      </div>
    </div>
  )
}
