import { ReactNode, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Car, CalendarDays, Users, Star, Tag, Settings, Bell,
  LogOut, Menu, X, BookOpen, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { to: '/admin/vehicles', label: 'Vehicles', icon: Car },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/promo-codes', label: 'Promo Codes', icon: Tag },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dbUser, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <Link to="/admin" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c9a84c] rounded-lg flex items-center justify-center">
              <Car size={16} className="text-black" />
            </div>
            <div>
              <div className="text-white text-xs font-bold leading-none">St Michael</div>
              <div className="text-[#c9a84c] text-xs">Admin</div>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-[#c9a84c] rounded-lg flex items-center justify-center mx-auto">
            <Car size={16} className="text-black" />
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#c9a84c] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        {!collapsed && (
          <div className="mb-3 px-2">
            <div className="text-white text-sm font-medium truncate">{dbUser?.name}</div>
            <div className="text-gray-500 text-xs truncate">{dbUser?.email}</div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className={`flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-[#0a0a0a] transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} flex-shrink-0`}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-full top-1/2 -translate-y-1/2 ml-1 w-6 h-6 bg-[#c9a84c] rounded-full flex items-center justify-center text-black shadow-md hover:bg-[#d4af37] transition-colors z-10"
          style={{ position: 'fixed', left: collapsed ? '52px' : '228px' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0a0a0a]">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Welcome back,</span>
            <span className="font-semibold text-gray-900">{dbUser?.name?.split(' ')[0]}</span>
          </div>
          <Link to="/" className="text-sm text-[#c9a84c] hover:underline">View Site</Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
