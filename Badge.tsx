import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'green' | 'red' | 'blue' | 'yellow' | 'gray' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variants = {
    gold: 'bg-amber-100 text-amber-800 border border-amber-200',
    green: 'bg-green-100 text-green-800 border border-green-200',
    red: 'bg-red-100 text-red-800 border border-red-200',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
