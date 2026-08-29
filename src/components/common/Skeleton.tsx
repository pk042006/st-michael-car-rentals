import { cn } from '../../lib/utils'
export function Skeleton({ className }: { className?: string }) { return <div className={cn('skeleton rounded-md', className)} /> }
export function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <Skeleton className="h-52 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /></div>
        <div className="flex justify-between items-center pt-2"><Skeleton className="h-6 w-24" /><Skeleton className="h-9 w-24 rounded-lg" /></div>
      </div>
    </div>
  )
}
export function BookingRowSkeleton() {
  return <tr className="border-b border-gray-100">{[...Array(6)].map((_, i) => <td key={i} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}</tr>
}