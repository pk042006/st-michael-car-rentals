import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { HomePage } from './pages/HomePage'
import { CarsPage } from './pages/CarsPage'
import { VehicleDetailPage } from './pages/VehicleDetailPage'
import { BookingPage } from './pages/BookingPage'
import { BookingConfirmationPage } from './pages/BookingConfirmationPage'
import { ServicesPage } from './pages/ServicesPage'
import { AboutPage } from './pages/AboutPage'
import { FAQPage } from './pages/FAQPage'
import { ContactPage } from './pages/ContactPage'
import { TermsPage, PrivacyPage, CancellationPage, RentalPolicyPage } from './pages/LegalPages'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { PageLayout } from './components/layout/PageLayout'
import { AccountLayout } from './pages/account/AccountLayout'
import { AccountDashboardPage } from './pages/account/AccountDashboardPage'
import { MyBookingsPage } from './pages/account/MyBookingsPage'
import { ProfilePage } from './pages/account/ProfilePage'
import { MyReviewsPage } from './pages/account/MyReviewsPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminGuard } from './pages/admin/AdminGuard'
import { AdminLayout } from './components/layout/AdminLayout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage'
import { AdminBookingDetailPage } from './pages/admin/AdminBookingDetailPage'
import { AdminVehiclesPage } from './pages/admin/AdminVehiclesPage'
import { AdminVehicleFormPage } from './pages/admin/AdminVehicleFormPage'
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage'
import { AdminCalendarPage } from './pages/admin/AdminCalendarPage'
import { AdminPromoCodesPage } from './pages/admin/AdminPromoCodesPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage'
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage'

function AdminPageWrapper({ children }: { children: React.ReactNode }) {
  return <AdminGuard><AdminLayout>{children}</AdminLayout></AdminGuard>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '12px', fontSize: '14px', fontWeight: 500 }, success: { iconTheme: { primary: '#c9a84c', secondary: '#000' } } }} />
          <Routes>
            <Route path="/" element={<PageLayout darkHero><HomePage /></PageLayout>} />
            <Route path="/cars" element={<PageLayout><CarsPage /></PageLayout>} />
            <Route path="/cars/:id" element={<PageLayout><VehicleDetailPage /></PageLayout>} />
            <Route path="/booking/:vehicleId" element={<PageLayout><BookingPage /></PageLayout>} />
            <Route path="/booking/confirmation/:bookingRef" element={<PageLayout><BookingConfirmationPage /></PageLayout>} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cancellation" element={<CancellationPage />} />
            <Route path="/rental-policy" element={<RentalPolicyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountLayout><AccountDashboardPage /></AccountLayout>} />
            <Route path="/account/bookings" element={<AccountLayout><MyBookingsPage /></AccountLayout>} />
            <Route path="/account/profile" element={<AccountLayout><ProfilePage /></AccountLayout>} />
            <Route path="/account/reviews" element={<AccountLayout><MyReviewsPage /></AccountLayout>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPageWrapper><AdminDashboardPage /></AdminPageWrapper>} />
            <Route path="/admin/bookings" element={<AdminPageWrapper><AdminBookingsPage /></AdminPageWrapper>} />
            <Route path="/admin/bookings/:id" element={<AdminPageWrapper><AdminBookingDetailPage /></AdminPageWrapper>} />
            <Route path="/admin/vehicles" element={<AdminPageWrapper><AdminVehiclesPage /></AdminPageWrapper>} />
            <Route path="/admin/vehicles/new" element={<AdminPageWrapper><AdminVehicleFormPage /></AdminPageWrapper>} />
            <Route path="/admin/vehicles/:id/edit" element={<AdminPageWrapper><AdminVehicleFormPage /></AdminPageWrapper>} />
            <Route path="/admin/customers" element={<AdminPageWrapper><AdminCustomersPage /></AdminPageWrapper>} />
            <Route path="/admin/calendar" element={<AdminPageWrapper><AdminCalendarPage /></AdminPageWrapper>} />
            <Route path="/admin/reviews" element={<AdminPageWrapper><AdminReviewsPage /></AdminPageWrapper>} />
            <Route path="/admin/promo-codes" element={<AdminPageWrapper><AdminPromoCodesPage /></AdminPageWrapper>} />
            <Route path="/admin/settings" element={<AdminPageWrapper><AdminSettingsPage /></AdminPageWrapper>} />
            <Route path="/admin/notifications" element={<AdminPageWrapper><AdminNotificationsPage /></AdminPageWrapper>} />
          </Routes>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App