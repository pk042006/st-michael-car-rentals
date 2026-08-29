import { Link } from 'react-router-dom'
import { Fuel, Settings, Users, Wind, Star, Crown } from 'lucide-react'
import { Vehicle } from '../../types/database'
import { formatCurrency } from '../../lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'

export function VehicleCard({ vehicle, avgRating }: { vehicle: Vehicle; avgRating?: number }) {
  const image = vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative overflow-hidden h-52">
        <img src={image} alt={`${vehicle.name} car rental`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
        <div className="absolute top-3 left-3 flex gap-2">
          {vehicle.is_premium && <Badge variant="gold" className="flex items-center gap-1 shadow-sm"><Crown size={10} /> Premium</Badge>}
          <Badge variant={vehicle.availability ? 'green' : 'red'}>{vehicle.availability ? 'Available' : 'Unavailable'}</Badge>
        </div>
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-semibold">{vehicle.category}</div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{vehicle.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{vehicle.brand} {vehicle.model}{vehicle.year && ` · ${vehicle.year}`}</span>
            {avgRating !== undefined && <div className="flex items-center gap-1 text-sm"><Star size={13} className="fill-[#c9a84c] text-[#c9a84c]" /><span className="font-semibold text-gray-700">{avgRating.toFixed(1)}</span></div>}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[{Icon: Settings, label: vehicle.transmission},{Icon: Fuel, label: vehicle.fuel},{Icon: Users, label: `${vehicle.seats} Seats`},{Icon: Wind, label: vehicle.air_conditioning ? 'A/C' : 'No A/C'}].map(({Icon, label}) => (
            <div key={label} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg"><Icon size={14} className="text-[#c9a84c]" /><span className="text-xs text-gray-600 text-center leading-tight">{label}</span></div>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div><div className="text-xl font-bold text-gray-900">{formatCurrency(vehicle.price_per_day)}</div><div className="text-xs text-gray-500">per day</div></div>
          <div className="flex gap-2">
            <Link to={`/cars/${vehicle.id}`}><Button variant="outline" size="sm">Details</Button></Link>
            {vehicle.availability && <Link to={`/booking/${vehicle.id}`}><Button size="sm">Book Now</Button></Link>}
          </div>
        </div>
      </div>
    </article>
  )
}