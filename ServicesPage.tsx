import { PageLayout } from '../components/layout/PageLayout'
import { MapPin, Car, Users, Clock, Phone, Shield, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const services = [
  { icon: MapPin, title: 'Airport Transfers', desc: 'Professional meet-and-greet at all major Ghanaian airports. Our courteous drivers will be waiting for you with a name board, ready to whisk you to your destination in comfort.', features: ['Accra (KIA) and Kumasi Airport', 'Punctual, tracked arrivals', 'Flight monitoring included'] },
  { icon: Car, title: 'Self-Drive Rentals', desc: 'Freedom to explore Ghana on your own terms. Our wide fleet of well-maintained vehicles is available for daily, weekly, and monthly hire.', features: ['Economy to Luxury options', 'Unlimited or extended mileage', 'Comprehensive insurance'] },
  { icon: Users, title: 'Chauffeur Service', desc: 'Travel in style with a professional driver. Ideal for business meetings, special occasions, corporate events, or simply when you prefer not to drive.', features: ['Experienced, licensed drivers', 'Flexible scheduling', 'Corporate accounts welcome'] },
  { icon: Clock, title: 'Long-Term Rental', desc: 'Extended rentals at significantly reduced rates. Perfect for expatriates, project workers, and businesses needing reliable transportation for weeks or months.', features: ['Discounted monthly rates', 'Dedicated account manager', 'Priority vehicle allocation'] },
  { icon: Phone, title: '24/7 Roadside Assistance', desc: 'We never leave you stranded. Our round-the-clock support team is ready to assist with any vehicle issue, anywhere in Ghana.', features: ['Nationwide coverage', '24/7 phone support', 'Rapid response time'] },
  { icon: Shield, title: 'Corporate Fleet Solutions', desc: 'Tailored fleet management for businesses of all sizes. From SMEs to large corporations, we provide reliable, scalable transportation solutions.', features: ['Consolidated monthly billing', 'Dedicated fleet manager', 'Custom SLAs available'] },
]

export function ServicesPage() {
  return (
    <PageLayout>
      <div className="pt-24 pb-16">
        {/* Hero */}
        <div className="bg-[#0a0a0a] py-20 px-4 text-center mb-16">
          <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">Our Services</span>
          <h1 className="font-serif text-5xl font-bold text-white mt-3 mb-4">More Than Car Rental</h1>
          <p className="text-gray-400 max-w-xl mx-auto">From airport pickups to long-term fleet solutions, we offer comprehensive mobility services tailored for individuals and businesses across Ghana.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map(s => (
              <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center mb-5">
                  <s.icon size={24} className="text-[#c9a84c]" />
                </div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">{s.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                <ul className="space-y-1.5">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-[#c9a84c] rounded-2xl p-10 text-center">
            <h2 className="font-serif text-3xl font-bold text-black mb-3">Ready to Book?</h2>
            <p className="text-black/70 mb-6">Browse our fleet and reserve your vehicle in minutes.</p>
            <Link to="/cars" className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-[#1a1a1a] text-white font-bold rounded-xl transition-all">
              Browse Vehicles <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
