import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Vehicle } from '../types/database'
import { VehicleCard } from '../components/common/VehicleCard'
import { VehicleCardSkeleton } from '../components/common/Skeleton'
import { Button } from '../components/common/Button'
import { VEHICLE_CATEGORIES } from '../lib/utils'

type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'newest'

export function CarsPage() {
  const [searchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filtered, setFiltered] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sort, setSort] = useState<SortOption>('price_asc')

  const [filters, setFilters] = useState({
    categories: [] as string[],
    transmission: [] as string[],
    fuel: [] as string[],
    available_only: false,
    premium_only: false,
    min_price: 0,
    max_price: 2000,
    min_seats: 0,
  })

  useEffect(() => {
    supabase.from('vehicles').select('*').order('price_per_day', { ascending: true })
      .then(({ data }) => {
        setVehicles(data || [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // Pre-populate filters from URL params
    const cat = searchParams.get('category')
    if (cat) setFilters(f => ({ ...f, categories: [cat] }))
  }, [searchParams])

  useEffect(() => {
    let result = [...vehicles]

    if (filters.categories.length > 0) result = result.filter(v => filters.categories.includes(v.category))
    if (filters.transmission.length > 0) result = result.filter(v => filters.transmission.includes(v.transmission))
    if (filters.fuel.length > 0) result = result.filter(v => filters.fuel.includes(v.fuel))
    if (filters.available_only) result = result.filter(v => v.availability)
    if (filters.premium_only) result = result.filter(v => v.is_premium)
    if (filters.min_seats > 0) result = result.filter(v => (v.seats || 0) >= filters.min_seats)
    result = result.filter(v => v.price_per_day >= filters.min_price && v.price_per_day <= filters.max_price)

    switch (sort) {
      case 'price_asc': result.sort((a, b) => a.price_per_day - b.price_per_day); break
      case 'price_desc': result.sort((a, b) => b.price_per_day - a.price_per_day); break
      case 'name_asc': result.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'newest': result.sort((a, b) => b.created_at.localeCompare(a.created_at)); break
    }

    setFiltered(result)
  }, [vehicles, filters, sort])

  const toggleFilter = (key: 'categories' | 'transmission' | 'fuel', value: string) => {
    setFilters(f => {
      const arr = f[key]
      return { ...f, [key]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value] }
    })
  }

  const clearFilters = () => {
    setFilters({ categories: [], transmission: [], fuel: [], available_only: false, premium_only: false, min_price: 0, max_price: 2000, min_seats: 0 })
  }

  const hasActiveFilters = filters.categories.length > 0 || filters.transmission.length > 0 || filters.fuel.length > 0 || filters.available_only || filters.premium_only || filters.min_seats > 0

  const FilterPanel = () => (
    <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Filter size={16} /> Filters</h2>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Vehicle Type</h3>
        <div className="space-y-2">
          {VEHICLE_CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleFilter('categories', cat)}
                className="w-4 h-4 accent-[#c9a84c]"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Transmission</h3>
        <div className="space-y-2">
          {['Automatic', 'Manual'].map(t => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={filters.transmission.includes(t)} onChange={() => toggleFilter('transmission', t)} className="w-4 h-4 accent-[#c9a84c]" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fuel */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Fuel Type</h3>
        <div className="space-y-2">
          {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => (
            <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={filters.fuel.includes(f)} onChange={() => toggleFilter('fuel', f)} className="w-4 h-4 accent-[#c9a84c]" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{f}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Max Price: GH₵{filters.max_price}/day</h3>
        <input
          type="range" min={100} max={2000} step={50}
          value={filters.max_price}
          onChange={e => setFilters(f => ({ ...f, max_price: +e.target.value }))}
          className="w-full accent-[#c9a84c]"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>GH₵100</span><span>GH₵2,000</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700">Available only</span>
          <div className={`w-10 h-5 rounded-full transition-colors relative ${filters.available_only ? 'bg-[#c9a84c]' : 'bg-gray-200'}`} onClick={() => setFilters(f => ({ ...f, available_only: !f.available_only }))}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.available_only ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700">Premium/Luxury</span>
          <div className={`w-10 h-5 rounded-full transition-colors relative ${filters.premium_only ? 'bg-[#c9a84c]' : 'bg-gray-200'}`} onClick={() => setFilters(f => ({ ...f, premium_only: !f.premium_only }))}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.premium_only ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </label>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Our Vehicle Fleet</h1>
          <p className="text-gray-600">Choose from our wide range of premium, well-maintained vehicles.</p>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort + Mobile filter button */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-[#c9a84c] transition-colors"
                >
                  <SlidersHorizontal size={16} /> Filters
                  {hasActiveFilters && <span className="w-5 h-5 bg-[#c9a84c] text-black text-xs rounded-full flex items-center justify-center font-bold">{filters.categories.length + filters.transmission.length + filters.fuel.length}</span>}
                </button>
                <span className="text-sm text-gray-600">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} found</span>
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name A-Z</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Mobile filter panel */}
            {filterOpen && (
              <div className="lg:hidden mb-5">
                <FilterPanel />
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <VehicleCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={32} className="text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 text-xl mb-2">No vehicles found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to find available vehicles.</p>
                <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(v => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
