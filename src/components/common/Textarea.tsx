import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string }
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, id, ...props }, ref) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">{label}{props.required && <span className="text-red-500 ml-1">*</span>}</label>}
      <textarea id={textareaId} ref={ref} className={cn('w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all resize-none', error ? 'border-red-400' : 'border-gray-300', className)} rows={4} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
})
Texarea.displayName = 'Textarea'