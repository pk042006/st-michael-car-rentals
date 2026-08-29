import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

interface Settings {
  business_name: string; business_phone: string; business_email: string;
  business_whatsapp: string; business_address: string; tax_rate: string;
  service_fee: string; happy_customers: string; vehicles_count: string;
  min_rental_days: string; max_rental_days: string; deposit_amount: string;
  facebook_url: string; instagram_url: string; twitter_url: string; cancellation_hours: string;
}

const defaultSettings: Settings = {
  business_name: 'St Michael Car Rentals', business_phone: '+233 24 000 0000',
  business_email: 'info@stmichaelcarrentals.com', business_whatsapp: '+233240000000',
  business_address: 'Accra, Ghana', tax_rate: '10', service_fee: '5',
  happy_customers: '100', vehicles_count: '20', min_rental_days: '1',
  max_rental_days: '30', deposit_amount: '500', facebook_url: '#',
  instagram_url: '#', twitter_url: '#', cancellation_hours: '24',
}

const SettingsContext = createContext<Settings>(defaultSettings)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const map: Partial<Settings> = {}
        data.forEach(({ key, value }) => { if (key in defaultSettings && value) (map as Record<string, string>)[key] = value })
        setSettings(prev => ({ ...prev, ...map }))
      }
    })
  }, [])
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

export function useSettings() { return useContext(SettingsContext) }