import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
export function AdminGuard({ children }: { children: ReactNode }) {
  const { supabaseUser, dbUser, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full" /></div>
  if (!supabaseUser) return <Navigate to="/admin/login" replace />
  if (dbUser && dbUser.role !== 'admin' && dbUser.role !== 'super_admin') return <Navigate to="/" replace />
  return <>{children}</>
}