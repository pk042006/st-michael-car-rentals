export type Database = {
  public: {
    Tables: {
      users: { Row: { id: string; name: string; email: string; phone: string | null; role: 'customer' | 'admin' | 'super_admin'; created_at: string }; Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'>; Update: Partial<Database['public']['Tables']['users']['Insert']> }
      vehicles: { Row: { id: string; name: string; brand: string; model: string; year: number | null; category: 'Economy' | 'Sedan' | 'SUV' | 'Luxury' | 'Van'; price_per_day: number; transmission: 'Automatic' | 'Manual'; fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'; seats: number | null; doors: number | null; air_conditioning: boolean; luggage: number | null; description: string | null; images: string[]; availability: boolean; is_premium: boolean; created_at: string }; Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'id' | 'created_at'>; Update: Partial<Database['public']['Tables']['vehicles']['Insert']> }
      bookings: { Row: { id: string; booking_reference: string; user_id: string | null; vehicle_id: string; pickup_location: string; return_location: string; pickup_date: string; pickup_time: string; return_date: string; return_time: string; status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected'; payment_status: 'unpaid' | 'pending' | 'paid' | 'refunded'; subtotal: number | null; extras_total: number; taxes: number | null; service_fee: number | null; total: number | null; promo_code: string | null; discount: number; notes: string | null; admin_notes: string | null; full_name: string; email: string; phone: string; country: string | null; company_name: string | null; driver_license_status: string | null; driver_age: number | null; additional_driver: boolean; additional_driver_name: string | null; created_at: string }; Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at'>; Update: Partial<Database['public']['Tables']['bookings']['Insert']> }
      booking_extras: { Row: { id: string; booking_id: string; extra_name: string; price: number }; Insert: Omit<Database['public']['Tables']['booking_extras']['Row'], 'id'>; Update: Partial<Database['public']['Tables']['booking_extras']['Insert']> }
      reviews: { Row: { id: string; user_id: string; vehicle_id: string; booking_id: string; rating: number; comment: string | null; created_at: string }; Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>; Update: Partial<Database['public']['Tables']['reviews']['Insert']> }
      promo_codes: { Row: { id: string; code: string; discount_type: 'percentage' | 'fixed'; discount_value: number; start_date: string | null; end_date: string | null; usage_limit: number | null; used_count: number; minimum_amount: number; active: boolean; created_at: string }; Insert: Omit<Database['public']['Tables']['promo_codes']['Row'], 'id' | 'created_at'>; Update: Partial<Database['public']['Tables']['promo_codes']['Insert']> }
      notifications: { Row: { id: string; user_id: string; title: string; message: string; type: string | null; read: boolean; created_at: string }; Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>; Update: Partial<Database['public']['Tables']['notifications']['Insert']> }
      site_settings: { Row: { key: string; value: string | null; updated_at: string }; Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'updated_at'>; Update: Partial<Database['public']['Tables']['site_settings']['Insert']> }
    }
  }
}

export type Vehicle = Database['public']['Tables']['vehicles']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type PromoCode = Database['public']['Tables']['promo_codes']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type BookingExtra = Database['public']['Tables']['booking_extras']['Row']