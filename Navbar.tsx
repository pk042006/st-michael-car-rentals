import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Car, Bell, User, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { supabaseUser, dbUser, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (supabaseUser) {
      supabase.from('notifications').select('id', { count: 'exact' }).eq('user_id', supabaseUser.id).eq('read', false)
        .then(({ count }) => setUnreadCount(count || 0))
    }
  }, [supabaseUser])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Our Cars' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About Us' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c] flex items-center justify-center shadow-lg group-hover:bg-[#d4af37] transition-colors">
              <Car size={22} className="text-black" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-none">St Michael</div>
              <div className="text-[#c9a84c] text-xs font-medium">Car Rentals</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-[#c9a84c]' : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {supabaseUser ? (
              <div className="hidden lg:flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="px-3 py-2 text-sm text-[#c9a84c] hover:bg-white/10 rounded-lg transition-colors font-medium">
                    Admin
                  </Link>
                )}
                <Link to="/account" className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c9a84c] text-black text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#c9a84c] flex items-center justify-center">
                      <span className="text-black text-xs font-bold">{dbUser?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium max-w-24 truncate">{dbUser?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 z-50">
                      <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <User size={15} /> My Account
                      </Link>
                      <Link to="/account/bookings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Car size={15} /> My Bookings
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium">
                  Sign In
                </Link>
              </div>
            )}
            <Link
              to="/cars"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] hover:bg-[#d4af37] text-black text-sm font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Book a Car
            </Link>
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 animate-fade-in">
            <nav className="flex flex-col gap-1 mt-4">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive ? 'text-[#c9a84c] bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {supabaseUser ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-[#c9a84c] hover:bg-white/10">Admin Panel</Link>
                  )}
                  <Link to="/account" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10">My Account</Link>
                  <button onClick={handleSignOut} className="px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-white/10 text-left">Sign Out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10">Sign In</Link>
              )}
              <Link to="/cars" onClick={() => setIsOpen(false)} className="mt-2 px-4 py-3 bg-[#c9a84c] hover:bg-[#d4af37] text-black text-sm font-bold rounded-xl text-center transition-colors">
                Book Now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
