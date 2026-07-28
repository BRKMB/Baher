import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './lib/store'
import { PhoneFrame } from './components/PhoneFrame'
import { TabBar } from './components/TabBar'
import { Dashboard } from './pages/Dashboard'
import { Analytics } from './pages/Analytics'
import { Calendar } from './pages/Calendar'
import { CancelCenter } from './pages/CancelCenter'
import { GuideDetail } from './pages/GuideDetail'
import { SubscriptionDetail } from './pages/SubscriptionDetail'
import { SubscriptionForm } from './pages/SubscriptionForm'
import { Settings } from './pages/Settings'

function Shell() {
  const location = useLocation()
  return (
    <div className="relative h-full">
      {/* key resets scroll position and replays the page transition */}
      <main key={location.pathname} className="h-full overflow-y-auto no-scrollbar">
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/cancel" element={<CancelCenter />} />
          <Route path="/cancel/:id" element={<GuideDetail />} />
          <Route path="/subs/:id" element={<SubscriptionDetail />} />
          <Route path="/add" element={<SubscriptionForm />} />
          <Route path="/edit/:id" element={<SubscriptionForm />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
      <TabBar />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <PhoneFrame>
          <Shell />
        </PhoneFrame>
      </BrowserRouter>
    </StoreProvider>
  )
}
