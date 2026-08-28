import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Eye, EyeOff, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import toast from 'react-hot-toast'

export function AdminLoginPage() {
  const { signIn, dbUser } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { setLoading(false); toast.error('Invalid credentials'); return }
    // Wait a tick for dbUser to load, then check role
    setTimeout(async () => {
      setLoading(false)
      navigate('/admin')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#c9a84c] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Car size={30} className="text-black" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield size={16} className="text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">Admin Portal</span>
          </div>
          <h1 className="text-white font-bold text-2xl">St Michael Car Rentals</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to access the admin dashboard</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                placeholder="admin@stmichaelcars.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300" aria-label="Toggle password">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-[#c9a84c] hover:bg-[#d4af37] text-black font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
