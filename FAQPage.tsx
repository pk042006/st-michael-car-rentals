import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'

const faqs = [
  { q: 'What documents do I need to rent a car?', a: 'You need a valid driver\'s license (Ghanaian or International), a national ID or passport, and payment for the rental and security deposit. Minimum age is 21 years.' },
  { q: 'What is the security deposit?', a: 'A refundable security deposit of GH₵500 is required at pickup. This is returned within 3-5 business days after the vehicle is returned in good condition.' },
  { q: 'Can I cancel my booking?', a: 'Yes. Free cancellation is available up to 24 hours before your pickup time. Cancellations made less than 24 hours before pickup may incur a cancellation fee equal to one day\'s rental.' },
  { q: 'Is insurance included in the rental price?', a: 'Yes. All our vehicles come with comprehensive third-party liability insurance. You can optionally add extra collision damage coverage as an add-on during booking.' },
  { q: 'Can I return the car to a different location?', a: 'Yes. We offer one-way rentals between our supported locations. Simply select a different return location during the booking process. A one-way fee may apply.' },
  { q: 'What happens if I return the car late?', a: 'A grace period of 30 minutes is allowed. After that, an additional full day\'s rental fee will be charged. Please contact us if you anticipate a delay.' },
  { q: 'Can I extend my rental?', a: 'Yes. Contact us at least 24 hours before your scheduled return time and we will do our best to extend your booking subject to availability.' },
  { q: 'Do you offer airport pickup and drop-off?', a: 'Yes. We offer meet-and-greet airport pickup services at Kotoka International Airport (KIA) in Accra and Kumasi Airport. This service can be added as an extra during booking.' },
  { q: 'What is the fuel policy?', a: 'Vehicles are provided with a full tank of fuel and should be returned full. If returned with less fuel, we will charge for the missing fuel at current market rates plus a refueling fee.' },
  { q: 'Can I add an additional driver?', a: 'Yes. An additional driver can be added for GH₵50 per day. The additional driver must meet all the same requirements as the primary driver and must be present at pickup.' },
  { q: 'What payment methods do you accept?', a: 'We accept Mobile Money (MTN, Vodafone, AirtelTigo), debit/credit cards, bank transfers, and cash. Full payment details are provided upon booking confirmation.' },
  { q: 'What should I do in case of an accident?', a: 'Contact our 24/7 emergency line immediately. Ensure all parties are safe, do not admit fault, take photos of the scene, and obtain a police report if required. We will guide you through the next steps.' },
]

export function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filtered = faqs.filter(f =>
    !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageLayout>
      <div className="pt-24 pb-16">
        <div className="bg-[#0a0a0a] py-20 px-4 text-center mb-16">
          <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">FAQ</span>
          <h1 className="font-serif text-5xl font-bold text-white mt-3 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Everything you need to know about renting with St Michael Car Rentals.</p>
          <div className="relative max-w-lg mx-auto mt-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No results for "{search}"</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:ring-inset"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                    <ChevronDown size={18} className={`text-[#c9a84c] flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                  </button>
                  {open === i && (
                    <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-2xl p-8 text-center">
            <h2 className="font-semibold text-gray-900 text-xl mb-2">Still have questions?</h2>
            <p className="text-gray-600 text-sm mb-4">Our team is available 24/7 to help.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="tel:+233240000000" className="px-5 py-2.5 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-[#1a1a1a] transition-colors">Call Us</a>
              <a href="https://wa.me/233240000000" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
