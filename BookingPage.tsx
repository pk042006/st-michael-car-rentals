import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Check, ChevronRight, ChevronLeft, Car, MapPin, User, FileText, Package, CreditCard, AlertCircle, Plus, Minus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Vehicle } from '../types/database'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { LOCATIONS, EXTRAS, formatCurrency, calculateDays, generateBookingReference } from '../lib/utils'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, label: 'Vehicle', icon: Car },
  { id: 2, label: 'Rental Details', icon: MapPin },
  { id: 3, label: 'Customer', icon: User },
  { id: 4, label: 'Driver Info', icon: FileText },
  { id: 5, label: 'Extras', icon: Package },
  { id: 6, label: 'Confirm', icon: CreditCard },
]

export function BookingPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const navigate = useNavigate()
  const { supabaseUser, dbUser } = useAuth()
  const settings = useSettings()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoApplied, setPromoApplied] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    pickup_location: LOCATIONS[0],
    return_location: LOCATIONS[0],
    same_location: true,
    pickup_date: '',
    pickup_time: '09:00',
    return_date: '',
    return_time: '09:00',
    full_name: dbUser?.name || '',
    email: dbUser?.email || '',
    phone: '',
    country: 'Ghana',
    company_name: '',
    driver_license_status: 'valid',
    driver_age: '',
    additional_driver: false,
    additional_driver_name: '',
    notes: '',
  })

  const [extras, setExtras] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!vehicleId) return
    setLoading(true)
    supabase.from('vehicles').select('*').eq('id', vehicleId).single()
      .then(({ data }) => {
        if (!data || !data.availability) { navigate('/cars'); return }
        setVehicle(data)
        setLoading(false)
      })
  }, [vehicleId, navigate])

  useEffect(() => {
    if (dbUser) {
      setForm(f => ({ ...f, full_name: dbUser.name, email: dbUser.email, phone: dbUser.phone || '' }))
    }
  }, [dbUser])

  const days = form.pickup_date && form.return_date ? calculateDays(form.pickup_date, form.return_date) : 0
  const subtotal = vehicle ? vehicle.price_per_day * days : 0

  const extrasTotal = EXTRAS.reduce((sum, extra) => {
    if (!extras[extra.id]) return sum
    return sum + (extra.type === 'per_day' ? extra.price * days : extra.price)
  }, 0)

  const taxRate = parseFloat(settings.tax_rate) / 100
  const serviceFeeRate = parseFloat(settings.service_fee) / 100
  const taxes = (subtotal + extrasTotal) * taxRate
  const serviceFee = (subtotal + extrasTotal) * serviceFeeRate
  const total = subtotal + extrasTotal + taxes + serviceFee - promoDiscount

  const validateStep = () => {
    const errs: Record<string, string> = {}
    if (step === 2) {
      if (!form.pickup_location) errs.pickup_location = 'Required'
      if (!form.return_location) errs.return_location = 'Required'
      if (!form.pickup_date) errs.pickup_date = 'Required'
      if (!form.return_date) errs.return_date = 'Required'
      if (form.pickup_date && form.return_date && form.return_date <= form.pickup_date) errs.return_date = 'Return date must be after pickup date'
    }
    if (step === 3) {
      if (!form.full_name.trim()) errs.full_name = 'Required'
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
      if (!form.phone.trim()) errs.phone = 'Required'
    }
    if (step === 4) {
      if (!form.driver_age) errs.driver_age = 'Required'
      if (parseInt(form.driver_age) < 18) errs.driver_age = 'Driver must be at least 18 years old'
      if (form.additional_driver && !form.additional_driver_name.trim()) errs.additional_driver_name = 'Additional driver name required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, 6))
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    setPromoLoading(true)
    const { data } = await supabase.from('promo_codes').select('*').eq('code', promoCode.toUpperCase()).eq('active', true).single()
    setPromoLoading(false)
    if (!data) { toast.error('Invalid or expired promo code'); return }
    const now = new Date()
    if (data.start_date && new Date(data.start_date) > now) { toast.error('Promo code not yet active'); return }
    if (data.end_date && new Date(data.end_date) < now) { toast.error('Promo code has expired'); return }
    if (data.minimum_amount && subtotal < data.minimum_amount) { toast.error(`Minimum order GH₵${data.minimum_amount} required`); return }
    if (data.usage_limit && data.used_count >= data.usage_limit) { toast.error('Promo code usage limit reached'); return }
    const discount = data.discount_type === 'percentage'
      ? (subtotal * data.discount_value) / 100
      : data.discount_value
    setPromoDiscount(discount)
    setPromoApplied(true)
    toast.success(`Promo applied! You save ${formatCurrency(discount)}`)
  }

  const handleSubmit = async () => {
    if (!agreedToTerms) { toast.error('Please agree to the terms and conditions'); return }
    if (!vehicle || !supabaseUser) {
      if (!supabaseUser) { toast.error('Please sign in to complete your booking'); navigate('/login'); return }
      return
    }

    // Check vehicle availability for the date range
    const { data: conflicting } = await supabase
      .from('bookings')
      .select('id')
      .eq('vehicle_id', vehicle.id)
      .in('status', ['confirmed', 'active', 'pending'])
      .or(`pickup_date.lte.${form.return_date},return_date.gte.${form.pickup_date}`)

    if (conflicting && conflicting.length > 0) {
      toast.error('Sorry, this vehicle is already booked for your selected dates. Please choose different dates.')
      return
    }

    setSubmitting(true)
    const bookingRef = generateBookingReference()

    try {
      const { data: booking, error } = await supabase.from('bookings').insert({
        booking_reference: bookingRef,
        user_id: supabaseUser.id,
        vehicle_id: vehicle.id,
        pickup_location: form.pickup_location,
        return_location: form.same_location ? form.pickup_location : form.return_location,
        pickup_date: form.pickup_date,
        pickup_time: form.pickup_time,
        return_date: form.return_date,
        return_time: form.return_time,
        status: 'pending',
        payment_status: 'unpaid',
        subtotal,
        extras_total: extrasTotal,
        taxes,
        service_fee: serviceFee,
        total,
        promo_code: promoApplied ? promoCode.toUpperCase() : null,
        discount: promoDiscount,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        company_name: form.company_name || null,
        driver_license_status: form.driver_license_status,
        driver_age: parseInt(form.driver_age),
        additional_driver: form.additional_driver,
        additional_driver_name: form.additional_driver ? form.additional_driver_name : null,
        notes: form.notes || null,
      }).select().single()

      if (error) throw error

      // Insert extras
      const extrasToInsert = EXTRAS.filter(e => extras[e.id]).map(e => ({
        booking_id: booking.id,
        extra_name: e.name,
        price: e.type === 'per_day' ? e.price * days : e.price,
      }))
      if (extrasToInsert.length > 0) {
        await supabase.from('booking_extras').insert(extrasToInsert)
      }

      // Update promo code used count
      if (promoApplied) {
        const { data: promo } = await supabase.from('promo_codes').select('used_count').eq('code', promoCode.toUpperCase()).single()
        if (promo) await supabase.from('promo_codes').update({ used_count: promo.used_count + 1 }).eq('code', promoCode.toUpperCase())
      }

      // Admin notification
      await supabase.from('notifications').insert({
        user_id: supabaseUser.id,
        title: 'Booking Submitted!',
        message: `Your booking ${bookingRef} has been submitted. We will confirm it shortly.`,
        type: 'booking',
        read: false,
      })

      navigate(`/booking/confirmation/${bookingRef}`)
    } catch (err: unknown) {
      toast.error('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const setField = (key: string, value: string | boolean) => {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full" />
    </div>
  )

  if (!vehicle) return null

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Book Your Vehicle</h1>
        <p className="text-gray-500 mb-8">Complete the steps below to reserve your car.</p>

        {/* Progress steps */}
        <div className="flex items-center mb-10 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex flex-col items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s.id ? 'bg-green-500 text-white' :
                  step === s.id ? 'bg-[#c9a84c] text-black shadow-lg' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.id ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <span className={`text-xs mt-1 font-medium whitespace-nowrap ${step === s.id ? 'text-[#c9a84c]' : step > s.id ? 'text-green-600' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

              {/* Step 1: Vehicle */}
              {step === 1 && (
                <div>
                  <h2 className="font-semibold text-xl text-gray-900 mb-5">Selected Vehicle</h2>
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <img
                      src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80'}
                      alt={vehicle.name}
                      className="w-28 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{vehicle.name}</h3>
                      <p className="text-gray-500 text-sm">{vehicle.category} · {vehicle.transmission} · {vehicle.fuel}</p>
                      <p className="text-[#c9a84c] font-bold text-lg mt-1">{formatCurrency(vehicle.price_per_day)}<span className="text-gray-500 font-normal text-sm">/day</span></p>
                    </div>
                  </div>
                  <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                    <AlertCircle size={15} className="inline mr-2" />
                    Minimum age: 18 years. Valid driver's license required. Refundable deposit of GH₵500 at pickup.
                  </div>
                </div>
              )}

              {/* Step 2: Rental Details */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-semibold text-xl text-gray-900">Rental Details</h2>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Pickup Location <span className="text-red-500">*</span></label>
                    <select value={form.pickup_location} onChange={e => setField('pickup_location', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {errors.pickup_location && <p className="text-xs text-red-600 mt-1">{errors.pickup_location}</p>}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" checked={form.same_location} onChange={e => setField('same_location', e.target.checked)} className="accent-[#c9a84c]" />
                    Return to same location
                  </label>
                  {!form.same_location && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Return Location <span className="text-red-500">*</span></label>
                      <select value={form.return_location} onChange={e => setField('return_location', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Pickup Date <span className="text-red-500">*</span></label>
                      <input type="date" min={today} value={form.pickup_date} onChange={e => setField('pickup_date', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                      {errors.pickup_date && <p className="text-xs text-red-600 mt-1">{errors.pickup_date}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Pickup Time</label>
                      <input type="time" value={form.pickup_time} onChange={e => setField('pickup_time', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Return Date <span className="text-red-500">*</span></label>
                      <input type="date" min={form.pickup_date || today} value={form.return_date} onChange={e => setField('return_date', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                      {errors.return_date && <p className="text-xs text-red-600 mt-1">{errors.return_date}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Return Time</label>
                      <input type="time" value={form.return_time} onChange={e => setField('return_time', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                    </div>
                  </div>
                  {days > 0 && (
                    <div className="p-3 bg-[#c9a84c]/10 rounded-xl text-sm font-medium text-gray-700">
                      Duration: <span className="text-[#c9a84c] font-bold">{days} day{days !== 1 ? 's' : ''}</span> · Subtotal: <span className="text-[#c9a84c] font-bold">{formatCurrency(subtotal)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Customer Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-xl text-gray-900">Customer Details</h2>
                  <Input label="Full Name" value={form.full_name} onChange={e => setField('full_name', e.target.value)} error={errors.full_name} required placeholder="Your full name" />
                  <Input label="Email Address" type="email" value={form.email} onChange={e => setField('email', e.target.value)} error={errors.email} required placeholder="your@email.com" />
                  <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} error={errors.phone} required placeholder="+233 XX XXX XXXX" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Country</label>
                    <input type="text" value={form.country} onChange={e => setField('country', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                  <Input label="Company Name (optional)" value={form.company_name} onChange={e => setField('company_name', e.target.value)} placeholder="For corporate bookings" />
                </div>
              )}

              {/* Step 4: Driver Info */}
              {step === 4 && (
                <div className="space-y-5">
                  <h2 className="font-semibold text-xl text-gray-900">Driver Information</h2>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">License Status <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                      {[
                        { value: 'valid', label: 'Valid Ghanaian License' },
                        { value: 'international', label: 'International License' },
                        { value: 'no_license', label: 'No License (Chauffeur required)' },
                      ].map(opt => (
                        <label key={opt.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-[#c9a84c] transition-colors">
                          <input type="radio" name="license" value={opt.value} checked={form.driver_license_status === opt.value} onChange={e => setField('driver_license_status', e.target.value)} className="accent-[#c9a84c]" />
                          <span className="text-sm text-gray-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Input label="Driver Age" type="number" min="18" max="99" value={form.driver_age} onChange={e => setField('driver_age', e.target.value)} error={errors.driver_age} required placeholder="e.g. 28" />
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.additional_driver} onChange={e => setField('additional_driver', e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Add additional driver</span>
                        <span className="text-xs text-gray-500 block">GH₵50/day extra</span>
                      </div>
                    </label>
                    {form.additional_driver && (
                      <Input className="mt-3" label="Additional Driver Name" value={form.additional_driver_name} onChange={e => setField('additional_driver_name', e.target.value)} error={errors.additional_driver_name} required placeholder="Full name" />
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Special Requests (optional)</label>
                    <textarea value={form.notes} onChange={e => setField('notes', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" rows={3} placeholder="Any special requests or notes..." />
                  </div>
                </div>
              )}

              {/* Step 5: Extras */}
              {step === 5 && (
                <div>
                  <h2 className="font-semibold text-xl text-gray-900 mb-2">Add Extras</h2>
                  <p className="text-sm text-gray-500 mb-5">Enhance your rental with these optional add-ons.</p>
                  <div className="space-y-3">
                    {EXTRAS.map(extra => {
                      const price = extra.type === 'per_day' ? extra.price * days : extra.price
                      const isSelected = !!extras[extra.id]
                      return (
                        <div key={extra.id} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${isSelected ? 'border-[#c9a84c] bg-[#c9a84c]/5' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setExtras(e => ({ ...e, [extra.id]: !e[extra.id] }))}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-[#c9a84c] border-[#c9a84c]' : 'border-gray-300'}`}>
                              {isSelected && <Check size={12} className="text-black" />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{extra.name}</div>
                              <div className="text-xs text-gray-500">{extra.description}</div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <div className="font-bold text-gray-900">{formatCurrency(price)}</div>
                            <div className="text-xs text-gray-500">{extra.type === 'per_day' ? `GH₵${extra.price}/day × ${days}d` : 'flat rate'}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 6: Review & Confirm */}
              {step === 6 && (
                <div className="space-y-5">
                  <h2 className="font-semibold text-xl text-gray-900">Review & Confirm</h2>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="font-semibold text-gray-900 mb-2">{vehicle.name}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Pickup:</span> <span className="font-medium">{form.pickup_date} at {form.pickup_time}</span></div>
                      <div><span className="text-gray-500">Return:</span> <span className="font-medium">{form.return_date} at {form.return_time}</span></div>
                      <div><span className="text-gray-500">Location:</span> <span className="font-medium">{form.pickup_location}</span></div>
                      <div><span className="text-gray-500">Duration:</span> <span className="font-medium">{days} day{days !== 1 ? 's' : ''}</span></div>
                      <div><span className="text-gray-500">Driver:</span> <span className="font-medium">{form.full_name}, Age {form.driver_age}</span></div>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal ({days} days × {formatCurrency(vehicle.price_per_day)})</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                    {extrasTotal > 0 && <div className="flex justify-between"><span className="text-gray-600">Extras</span><span className="font-medium">{formatCurrency(extrasTotal)}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-600">Taxes ({settings.tax_rate}%)</span><span className="font-medium">{formatCurrency(taxes)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Service Fee ({settings.service_fee}%)</span><span className="font-medium">{formatCurrency(serviceFee)}</span></div>
                    {promoDiscount > 0 && <div className="flex justify-between text-green-600"><span>Promo Discount</span><span>-{formatCurrency(promoDiscount)}</span></div>}
                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2"><span>Total</span><span className="text-[#c9a84c]">{formatCurrency(Math.max(0, total))}</span></div>
                  </div>

                  {/* Promo code */}
                  {!promoApplied && (
                    <div className="flex gap-2">
                      <input
                        type="text" placeholder="Promo code" value={promoCode}
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                      />
                      <Button onClick={handleApplyPromo} loading={promoLoading} variant="outline" size="md">Apply</Button>
                    </div>
                  )}
                  {promoApplied && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <Check size={15} /> Promo code "{promoCode}" applied — saving {formatCurrency(promoDiscount)}
                    </div>
                  )}

                  {/* Payment info */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Payment Methods</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Mobile Money', 'Bank Card', 'Bank Transfer', 'Cash on Pickup'].map(m => (
                        <span key={m} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs font-medium text-blue-700">{m}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Our team will contact you to arrange payment after booking confirmation.</p>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="accent-[#c9a84c] mt-0.5 w-4 h-4 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      I agree to the <Link to="/terms" target="_blank" className="text-[#c9a84c] underline">Terms & Conditions</Link>, <Link to="/cancellation" target="_blank" className="text-[#c9a84c] underline">Cancellation Policy</Link>, and <Link to="/rental-policy" target="_blank" className="text-[#c9a84c] underline">Rental Policy</Link>.
                    </span>
                  </label>

                  {!supabaseUser && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
                      <AlertCircle size={14} className="inline mr-2" />
                      You need to <Link to="/login" className="font-semibold underline">sign in</Link> or <Link to="/register" className="font-semibold underline">create an account</Link> to complete your booking.
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(s => s - 1)}>
                    <ChevronLeft size={16} /> Previous
                  </Button>
                ) : <div />}
                {step < 6 ? (
                  <Button onClick={nextStep}>
                    Next <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} loading={submitting} disabled={!agreedToTerms}>
                    Confirm Booking
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Booking summary sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <img
                src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80'}
                alt={vehicle.name}
                className="w-full h-36 object-cover rounded-xl mb-3"
              />
              <div className="font-bold text-gray-900">{vehicle.name}</div>
              <div className="text-sm text-gray-500 mb-4">{vehicle.category} · {vehicle.transmission}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Rate/day</span><span className="font-medium">{formatCurrency(vehicle.price_per_day)}</span></div>
                {days > 0 && (
                  <>
                    <div className="flex justify-between"><span className="text-gray-500">Days</span><span className="font-medium">{days}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                    {extrasTotal > 0 && <div className="flex justify-between"><span className="text-gray-500">Extras</span><span className="font-medium">{formatCurrency(extrasTotal)}</span></div>}
                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Est. Total</span><span className="text-[#c9a84c]">{formatCurrency(Math.max(0, total))}</span></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
