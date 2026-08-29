import { Star } from 'lucide-react'
export function StarRating({ rating, max = 5, size = 16, interactive, onChange }: { rating: number; max?: number; size?: number; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => (
        <Star key={i} size={size} className={`${i < rating ? 'fill-[#c9a84c] text-[#c9a84c]' : 'fill-gray-200 text-gray-200'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`} onClick={() => interactive && onChange?.(i + 1)} />
      ))}
    </div>
  )
}