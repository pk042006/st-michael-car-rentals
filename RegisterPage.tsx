import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import toast from 'react-hot-toast'

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string,string> = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.password || form.password.length < 6) errs.password = 'At least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.name, form.phone)
    setLoading(false)
    if (error) { toast.error(error); return }
    toast.success('Account created! Please check your email to verify.')
    navigate('/account')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#c9a84c] flex items-center justify-center">
              <Car size={24} className="text-black" />
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Create an account</h1>
          <p className="text-gray-500 mt-2">Book cars and manage your rentals</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} error={errors.name} placeholder="Your full name" required />
            <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} error={errors.email} placeholder="your@email.com" required />
            <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+233 XX XXX XXXX" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className={`w-full px-4 py-2.5 pr-10 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] ${errors.password ? 'border-red-400' : 'border-gray-300'}`} placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Toggle password">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>
            <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={e => setForm(f => ({...f, confirmPassword: e.target.value}))} error={errors.confirmPassword} placeholder="Repeat password" required />
            <Button type="submit" size="lg" className="w-full" loading={loading}>Create Account</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#c9a84c] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
