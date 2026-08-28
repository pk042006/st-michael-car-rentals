import { MessageCircle } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export function WhatsAppButton() {
  const settings = useSettings()
  const message = encodeURIComponent('Hello! I am interested in renting a car from St Michael Car Rentals.')

  return (
    <a
      href={`https://wa.me/${settings.business_whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-500/30"
    >
      <MessageCircle size={26} className="text-white" />
    </a>
  )
}
