import { ReactNode } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { LayoutDashboard, Car, User, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PageLayout } from '../../components/layout/PageLayout'

const navItems = [
  { to: '/account', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/account/bookings', label: 'My Bookings', icon: Car },
  { to: '/account/profile', label: 'Profile', icon: User },
  { to: '/account/reviews', label: 'Reviews', icon: Star },
]

export function AccountLayout({ children }: { children: ReactNode }) {
  const { supabaseUser, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full" />
    </div>
  )
  if (!supabaseUser) return <Navigate to="/login" state={{ from: '/account' }} replace />

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-52 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[#c9a84c] text-black' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </PageLayout>
  )
}
