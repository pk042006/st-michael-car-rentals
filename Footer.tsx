import { Link } from 'react-router-dom'
import { Car, Phone, Mail, MapPin, MessageCircle, ExternalLink } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export function Footer() {
  const settings = useSettings()

  return (
    <footer className="bg-[#0a0a0a] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c] flex items-center justify-center">
                <Car size={22} className="text-black" />
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none">St Michael</div>
                <div className="text-[#c9a84c] text-xs font-medium">Car Rentals</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Premium car rental services in Ghana. Reliable, comfortable, and affordable vehicles for every journey.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: settings.facebook_url, label: 'Facebook' },
                { href: settings.instagram_url, label: 'Instagram' },
                { href: settings.twitter_url, label: 'Twitter/X' },
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#c9a84c] hover:text-black flex items-center justify-center transition-all text-gray-400"
                >
                  <ExternalLink size={15} />
                </a>
              ))}
              <a
                href={`https://wa.me/${settings.business_whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#c9a84c] hover:text-black flex items-center justify-center transition-all text-gray-400"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/cars', label: 'Our Cars' },
                { to: '/services', label: 'Services' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/faq', label: 'FAQ' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-[#c9a84c] transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Customer</h3>
            <ul className="space-y-3">
              {[
                { to: '/cars', label: 'Book a Car' },
                { to: '/account/bookings', label: 'My Bookings' },
                { to: '/terms', label: 'Terms & Conditions' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/cancellation', label: 'Cancellation Policy' },
                { to: '/rental-policy', label: 'Rental Policy' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-[#c9a84c] transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <a href={`tel:${settings.business_phone}`} className="text-sm hover:text-[#c9a84c] transition-colors">{settings.business_phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <a href={`mailto:${settings.business_email}`} className="text-sm hover:text-[#c9a84c] transition-colors break-all">{settings.business_email}</a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={16} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <a href={`https://wa.me/${settings.business_whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-[#c9a84c] transition-colors">WhatsApp Us</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <span className="text-sm">{settings.business_address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2026 St Michael Car Rentals. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="hover:text-[#c9a84c] transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-[#c9a84c] transition-colors">Privacy</Link>
            <Link to="/cancellation" className="hover:text-[#c9a84c] transition-colors">Cancellation</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
