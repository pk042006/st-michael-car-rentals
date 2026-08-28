import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Car, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import toast from 'react-hot-toast'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string,string> = {}
    if (!email) errs.email = 'Required'
    if (!password) errs.password = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { toast.error('Invalid email or password'); return }
    navigate(from, { replace: true })
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
          <h1 className="font-serif text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your bookings</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} placeholder="your@email.com" required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" loading={loading}>Sign In</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#c9a84c] font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
