import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) { return clsx(inputs) }

export function formatCurrency(amount: number): string {
  return `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'SMC-'
  for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length))
  return result
}

export function calculateDays(pickupDate: string, returnDate: string): number {
  const diff = new Date(returnDate).getTime() - new Date(pickupDate).getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-GH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const LOCATIONS = [
  'Accra Airport (KIA)', 'Accra City Centre', 'Tema', 'East Legon',
  'Cantonments', 'Labone', 'Airport Residential', 'Kumasi City Centre',
  'Kumasi Airport', 'Takoradi', 'Cape Coast', 'Sunyani', 'Ho', 'Koforidua',
]

export const VEHICLE_CATEGORIES = ['Economy', 'Sedan', 'SUV', 'Luxury', 'Van'] as const

export const EXTRAS = [
  { id: 'additional_driver', name: 'Additional Driver', price: 50, type: 'per_day', description: 'Add another authorized driver' },
  { id: 'child_seat', name: 'Child Seat', price: 20, type: 'per_day', description: 'Certified child safety seat' },
  { id: 'gps', name: 'GPS Navigation', price: 15, type: 'per_day', description: 'In-car GPS device' },
  { id: 'airport_pickup', name: 'Airport Pickup', price: 100, type: 'flat', description: 'Meet and greet at the airport' },
  { id: 'delivery_service', name: 'Delivery Service', price: 80, type: 'flat', description: 'Vehicle delivered to your location' },
  { id: 'extra_insurance', name: 'Extra Insurance', price: 30, type: 'per_day', description: 'Comprehensive collision protection' },
  { id: 'extended_mileage', name: 'Extended Mileage', price: 40, type: 'per_day', description: 'Unlimited mileage package' },
] as const

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800', completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800', rejected: 'bg-red-100 text-red-800',
    unpaid: 'bg-red-100 text-red-800', paid: 'bg-green-100 text-green-800',
    refunded: 'bg-purple-100 text-purple-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}