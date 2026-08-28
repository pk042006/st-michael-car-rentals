import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import toast from 'react-hot-toast'

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      const map: Record<string, string> = {}
      data?.forEach(({ key, value }) => { if (value) map[key] = value })
      setSettings(map)
      setLoading(false)
    })
  }, [])

  const set = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    const upserts = Object.entries(settings).map(([key, value]) => ({
      key, value, updated_at: new Date().toISOString()
    }))
    const { error } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })
    setSaving(false)
    if (error) { toast.error('Failed to save settings'); return }
    toast.success('Settings saved successfully')
  }

  const Field = ({ label, k, type = 'text', placeholder = '' }: { label: string; k: string; type?: string; placeholder?: string }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={settings[k] || ''}
        onChange={e => set(k, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
      />
    </div>
  )

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-[#c9a84c] border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-serif text-3xl font-bold text-gray-900">Site Settings</h1>

      {[
        {
          title: 'Business Information',
          fields: [
            { label: 'Business Name', k: 'business_name' },
            { label: 'Phone Number', k: 'business_phone', placeholder: '+233 XX XXX XXXX' },
            { label: 'Email Address', k: 'business_email', type: 'email' },
            { label: 'WhatsApp Number', k: 'business_whatsapp', placeholder: '+233XXXXXXXXX' },
            { label: 'Address', k: 'business_address' },
          ]
        },
        {
          title: 'Pricing',
          fields: [
            { label: 'Tax Rate (%)', k: 'tax_rate', type: 'number', placeholder: '10' },
            { label: 'Service Fee (%)', k: 'service_fee', type: 'number', placeholder: '5' },
            { label: 'Security Deposit (GH₵)', k: 'deposit_amount', type: 'number', placeholder: '500' },
          ]
        },
        {
          title: 'Booking Settings',
          fields: [
            { label: 'Minimum Rental Days', k: 'min_rental_days', type: 'number', placeholder: '1' },
            { label: 'Maximum Rental Days', k: 'max_rental_days', type: 'number', placeholder: '30' },
            { label: 'Free Cancellation (hours notice)', k: 'cancellation_hours', type: 'number', placeholder: '24' },
          ]
        },
        {
          title: 'Homepage Stats',
          fields: [
            { label: 'Happy Customers Count', k: 'happy_customers', type: 'number', placeholder: '100' },
            { label: 'Vehicles Count', k: 'vehicles_count', type: 'number', placeholder: '20' },
          ]
        },
        {
          title: 'Social Links',
          fields: [
            { label: 'Facebook URL', k: 'facebook_url', placeholder: 'https://facebook.com/...' },
            { label: 'Instagram URL', k: 'instagram_url', placeholder: 'https://instagram.com/...' },
            { label: 'Twitter/X URL', k: 'twitter_url', placeholder: 'https://x.com/...' },
          ]
        },
      ].map(section => (
        <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.fields.map(f => <Field key={f.k} {...f} />)}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} size="lg">Save All Settings</Button>
      </div>
    </div>
  )
}
