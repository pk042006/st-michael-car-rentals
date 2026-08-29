import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { User } from '../types/database'

interface AuthContextType {
  supabaseUser: SupabaseUser | null
  dbUser: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isSuperAdmin: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [dbUser, setDbUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDbUser = async (userId: string) => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single()
    setDbUser(data)
  }

  const refreshUser = async () => { if (supabaseUser) await fetchDbUser(supabaseUser.id) }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null)
      if (session?.user) fetchDbUser(session.user.id)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null)
      if (session?.user) { fetchDbUser(session.user.id) } else { setDbUser(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? error.message : null }
  }

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    if (data.user) {
      const { error: dbError } = await supabase.from('users').insert({ id: data.user.id, name, email, phone: phone || null, role: 'customer' })
      if (dbError) return { error: dbError.message }
    }
    return { error: null }
  }

  const signOut = async () => { await supabase.auth.signOut() }

  return (
    <AuthContext.Provider value={{ supabaseUser, dbUser, loading, signIn, signUp, signOut, isAdmin: dbUser?.role === 'admin' || dbUser?.role === 'super_admin', isSuperAdmin: dbUser?.role === 'super_admin', refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}