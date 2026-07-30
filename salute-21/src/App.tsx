import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { ReservePage } from './pages/ReservePage'
import { BookingSuccessPage } from './pages/BookingSuccessPage'
import { AdminBookingsPage } from './pages/AdminBookingsPage'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reserve" element={<ReservePage />} />
          <Route path="/reserve/success/:id" element={<BookingSuccessPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}
