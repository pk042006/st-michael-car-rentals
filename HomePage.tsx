import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Shield, Clock, MapPin, Star, Users, Car, Headphones, Award, CheckCircle, Phone, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Vehicle, Review } from '../types/database'
import { VehicleCard } from '../components/common/VehicleCard'
import { VehicleCardSkeleton } from '../components/common/Skeleton'
import { Button } from '../components/common/Button'
import { Select } from '../components/common/Select'
import { useSettings } from '../context/SettingsContext'
import { LOCATIONS, VEHICLE_CATEGORIES, formatDate } from '../lib/utils'
import { StarRating } from '../components/common/StarRating'

function useInView(ref: React.RefObject<Element>, threshold = 0.1) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect() }
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, threshold])
  return inView
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null!)
  const inView = useInView(ref)
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  )
}

export function HomePage() {
  const navigate = useNavigate()
  const settings = useSettings()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [reviews, setReviews] = useState<(Review & { users: { name: string } | null; vehicles: { name: string } | null })[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [reviewIndex, setReviewIndex] = useState(0)

  const [search, setSearch] = useState({
    pickup_location: '', return_location: '', same_location: true,
    pickup_date: '', pickup_time: '09:00', return_date: '', return_time: '09:00',
    category: '',
  })

  useEffect(() => {
    supabase.from('vehicles').select('*').eq('availability', true).limit(6)
      .then(({ data }) => { setVehicles(data || []); setLoadingVehicles(false) })

    supabase.from('reviews').select('*, users(name), vehicles(name)').order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => setReviews(data as typeof reviews || []))
  }, [])

  useEffect(() => {
    if (reviews.length < 2) return
    const timer = setInterval(() => setReviewIndex(i => (i + 1) % reviews.length), 5000)
    return () => clearInterval(timer)
  }, [reviews.length])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.pickup_location) params.set('pickup_location', search.pickup_location)
    if (search.category) params.set('category', search.category)
    if (search.pickup_date) params.set('pickup_date', search.pickup_date)
    if (search.return_date) params.set('return_date', search.return_date)
    navigate(`/cars?${params.toString()}`)
  }

  const today = new Date().toISOString().split('T')[0]

  const whyChooseUs = [
    { icon: Shield, title: 'Fully Insured', desc: 'All vehicles comprehensively insured for your peace of mind.' },
    { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock customer service whenever you need us.' },
    { icon: MapPin, title: 'Multiple Locations', desc: 'Pick up and drop off across key locations in Ghana.' },
    { icon: Award, title: 'Premium Fleet', desc: 'Well-maintained vehicles serviced to the highest standards.' },
    { icon: CheckCircle, title: 'Easy Booking', desc: 'Book in minutes with our simple and secure online system.' },
    { icon: Headphones, title: 'Flexible Rentals', desc: 'Daily, weekly, and monthly rental options to suit your needs.' },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1920&q=85"
            alt="Luxury car"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-28 pb-12">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Star size={14} className="fill-current" /> Ghana's Premium Car Rental
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Premium Cars.
            <span className="block text-[#c9a84c]">Exceptional Journeys.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Reliable, comfortable and affordable car rentals designed to make every journey simple and stress-free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-gray-300">
            {['Trusted Service', 'Well-Maintained Cars', 'Flexible Rental Options'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#c9a84c]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/cars">
              <Button size="lg">Book Your Car <ArrowRight size={18} /></Button>
            </Link>
            <Link to="/cars">
              <Button size="lg" variant="outline">Explore Our Cars</Button>
            </Link>
          </div>
        </div>

        {/* Booking Search Widget */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-8">
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-white text-xs font-medium">Pickup Location</label>
                <select
                  className="px-3 py-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  value={search.pickup_location}
                  onChange={e => setSearch(s => ({ ...s, pickup_location: e.target.value }))}
                >
                  <option value="">Any Location</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white text-xs font-medium">Vehicle Type</label>
                <select
                  className="px-3 py-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  value={search.category}
                  onChange={e => setSearch(s => ({ ...s, category: e.target.value }))}
                >
                  <option value="">All Types</option>
                  {VEHICLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white text-xs font-medium">Pickup Date</label>
                <input
                  type="date" min={today}
                  className="px-3 py-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  value={search.pickup_date}
                  onChange={e => setSearch(s => ({ ...s, pickup_date: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white text-xs font-medium">Return Date</label>
                <input
                  type="date" min={search.pickup_date || today}
                  className="px-3 py-2.5 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                  value={search.return_date}
                  onChange={e => setSearch(s => ({ ...s, return_date: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Search Available Cars <ChevronRight size={18} />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0a0a0a] py-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: `${settings.happy_customers}+`, label: 'Happy Customers' },
              { value: `${settings.vehicles_count}+`, label: 'Vehicles Available' },
              { value: '24/7', label: 'Customer Support' },
              { value: '5★', label: 'Service Rating' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-[#c9a84c] mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mt-2">The St Michael Difference</h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto">We go beyond just renting cars — we deliver peace of mind and an exceptional experience every time.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <AnimatedSection key={item.title} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-[#c9a84c]" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">Our Fleet</span>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mt-2">Featured Vehicles</h2>
            </div>
            <Link to="/cars" className="hidden sm:flex items-center gap-2 text-[#c9a84c] font-semibold hover:gap-3 transition-all">
              View All <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingVehicles
              ? [...Array(6)].map((_, i) => <VehicleCardSkeleton key={i} />)
              : vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)
            }
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Link to="/cars"><Button size="lg">View All Cars</Button></Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">Services</span>
            <h2 className="font-serif text-4xl font-bold text-white mt-2">What We Offer</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Airport Transfers', desc: 'Professional meet-and-greet service at all major airports across Ghana.', icon: MapPin },
              { title: 'Corporate Rentals', desc: 'Tailored fleet solutions and billing for businesses of all sizes.', icon: Award },
              { title: 'Self-Drive', desc: 'Freedom to explore Ghana at your own pace with our well-maintained vehicles.', icon: Car },
              { title: 'Chauffeur Service', desc: 'Professional, courteous drivers available on request for any journey.', icon: Users },
              { title: 'Long-Term Rental', desc: 'Special rates for weekly and monthly rentals — great value for extended stays.', icon: Clock },
              { title: '24/7 Roadside Assist', desc: 'Round-the-clock support wherever your journey takes you in Ghana.', icon: Phone },
            ].map((s, i) => (
              <AnimatedSection key={s.title}>
                <div className="border border-white/10 rounded-2xl p-7 hover:border-[#c9a84c]/50 transition-all duration-300 hover:bg-white/5">
                  <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/20 flex items-center justify-center mb-4">
                    <s.icon size={24} className="text-[#c9a84c]" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section className="py-20 bg-[#f5f5f5]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <AnimatedSection>
              <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">Reviews</span>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mt-2 mb-12">What Our Customers Say</h2>
              <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="text-6xl text-[#c9a84c]/20 font-serif absolute top-4 left-8">"</div>
                <StarRating rating={reviews[reviewIndex]?.rating || 5} size={22} />
                <p className="text-gray-700 text-lg leading-relaxed mt-4 mb-6 italic">
                  "{reviews[reviewIndex]?.comment || 'Excellent service!'}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{reviews[reviewIndex]?.users?.name || 'Valued Customer'}</div>
                  {reviews[reviewIndex]?.vehicles?.name && (
                    <div className="text-sm text-gray-500">Rented: {reviews[reviewIndex].vehicles!.name}</div>
                  )}
                </div>
              </div>
              {reviews.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${i === reviewIndex ? 'bg-[#c9a84c] w-6' : 'bg-gray-300'}`}
                      aria-label={`Go to review ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 bg-[#c9a84c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <AnimatedSection className="relative z-10 text-center px-4">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-black mb-4">Ready to Hit the Road?</h2>
          <p className="text-black/70 text-lg max-w-xl mx-auto mb-8">
            Browse our premium fleet and book your perfect vehicle in minutes.
          </p>
          <Link to="/cars">
            <Button variant="secondary" size="lg">Book Your Car Now <ArrowRight size={18} /></Button>
          </Link>
        </AnimatedSection>
      </section>
    </div>
  )
}
