import { PageLayout } from '../components/layout/PageLayout'
import { useSettings } from '../context/SettingsContext'
import { CheckCircle, Target, Eye, Heart } from 'lucide-react'

export function AboutPage() {
  const settings = useSettings()

  return (
    <PageLayout>
      <div className="pt-24 pb-16">
        {/* Hero */}
        <div className="relative bg-[#0a0a0a] py-24 px-4 text-center mb-16 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">About Us</span>
            <h1 className="font-serif text-5xl font-bold text-white mt-3 mb-4">Our Story</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">Bringing premium, reliable car rental services to Ghana — one journey at a time.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">Who We Are</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mt-2 mb-4">Built on Trust, Driven by Excellence</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                St Michael Car Rentals was founded with a simple mission: to provide Ghanaians and visitors with a car rental experience that matches international standards. We believe every journey should start with confidence.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From our carefully maintained fleet to our dedicated support team, everything we do is focused on giving you a seamless, stress-free experience from the moment you book to the moment you return the keys.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80" alt="Our team" className="w-full h-80 object-cover" />
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Target, title: 'Our Mission', text: 'To provide Ghana\'s most reliable, affordable, and premium car rental experience, making quality transportation accessible to everyone.' },
              { icon: Eye, title: 'Our Vision', text: 'To be West Africa\'s most trusted mobility partner, expanding our fleet and services across the region while maintaining our commitment to excellence.' },
              { icon: Heart, title: 'Our Values', text: 'Integrity, reliability, customer-first thinking, and a relentless drive to improve the standard of transportation services in Ghana.' },
            ].map(item => (
              <div key={item.title} className="bg-[#0a0a0a] rounded-2xl p-7 text-white">
                <div className="w-12 h-12 bg-[#c9a84c]/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-[#c9a84c]" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-[#c9a84c] rounded-2xl p-8 mb-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: `${settings.happy_customers}+`, label: 'Happy Customers' },
                { value: `${settings.vehicles_count}+`, label: 'Vehicles Available' },
                { value: '5+', label: 'Years Experience' },
                { value: '4', label: 'Cities Covered' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-4xl font-bold text-black mb-1">{s.value}</div>
                  <div className="text-black/70 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Why us */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-8">Why Customers Choose Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Professionally maintained, clean vehicles', 'Transparent pricing with no hidden fees',
                'Flexible pickup and return locations', '24/7 roadside assistance and support',
                'Comprehensive insurance on all rentals', 'Easy online booking in under 5 minutes',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle size={18} className="text-[#c9a84c] flex-shrink-0" />
                  <span className="text-gray-800 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
