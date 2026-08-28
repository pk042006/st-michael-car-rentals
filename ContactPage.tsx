import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Textarea } from '../components/common/Textarea'
import { useSettings } from '../context/SettingsContext'
import toast from 'react-hot-toast'

export function ContactPage() {
  const settings = useSettings()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill in required fields'); return }
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    setSending(false)
    toast.success('Message sent! We will get back to you within 24 hours.')
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <PageLayout>
      <div className="pt-24 pb-16">
        <div className="bg-[#0a0a0a] py-20 px-4 text-center mb-16">
          <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-wider">Contact</span>
          <h1 className="font-serif text-5xl font-bold text-white mt-3 mb-4">Get in Touch</h1>
          <p className="text-gray-400 max-w-xl mx-auto">We're here to help. Reach us by phone, WhatsApp, email, or the form below.</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-5">Contact Information</h2>
                <div className="space-y-4">
                  {[
                    { icon: Phone, label: 'Phone', value: settings.business_phone, href: `tel:${settings.business_phone}` },
                    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us on WhatsApp', href: `https://wa.me/${settings.business_whatsapp}` },
                    { icon: Mail, label: 'Email', value: settings.business_email, href: `mailto:${settings.business_email}` },
                    { icon: MapPin, label: 'Address', value: settings.business_address, href: null },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-10 h-10 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon size={18} className="text-[#c9a84c]" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">{item.label}</div>
                        {item.href ? (
                          <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-[#c9a84c] transition-colors">{item.value}</a>
                        ) : (
                          <span className="text-gray-900 font-medium">{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-[#0a0a0a] rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-[#c9a84c]" />
                  <span className="text-white font-semibold">Business Hours</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400"><span>Monday - Friday</span><span className="text-white">7:00 AM - 8:00 PM</span></div>
                  <div className="flex justify-between text-gray-400"><span>Saturday</span><span className="text-white">8:00 AM - 6:00 PM</span></div>
                  <div className="flex justify-between text-gray-400"><span>Sunday</span><span className="text-white">9:00 AM - 4:00 PM</span></div>
                  <div className="flex justify-between text-gray-400"><span>Emergency/Roadside</span><span className="text-[#c9a84c]">24/7</span></div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="h-52 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <MapPin size={32} className="text-[#c9a84c] mx-auto mb-2" />
                  <p className="text-gray-600 text-sm font-medium">{settings.business_address}</p>
                  <a href={`https://maps.google.com?q=${encodeURIComponent(settings.business_address)}`} target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] text-xs hover:underline mt-1 inline-block">View on Google Maps</a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-5">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" value={form.name} onChange={e => setField('name', e.target.value)} required placeholder="Your name" />
                <Input label="Email Address" type="email" value={form.email} onChange={e => setField('email', e.target.value)} required placeholder="your@email.com" />
                <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+233 XX XXX XXXX" />
                <Input label="Subject" value={form.subject} onChange={e => setField('subject', e.target.value)} placeholder="How can we help?" />
                <Textarea label="Message" value={form.message} onChange={e => setField('message', e.target.value)} required placeholder="Tell us about your inquiry..." rows={5} />
                <Button type="submit" size="lg" loading={sending} className="w-full">
                  <Send size={16} /> Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
