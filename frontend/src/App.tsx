import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppShell from './components/layout/AppShell'
import LandingPage from './pages/LandingPage'

const DashboardPage     = lazy(() => import('./pages/DashboardPage'))
const ExpensesPage      = lazy(() => import('./pages/ExpensesPage'))
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage'))
const BudgetPage        = lazy(() => import('./pages/BudgetPage'))
const AnalyticsPage     = lazy(() => import('./pages/AnalyticsPage'))
const AIAssistantPage   = lazy(() => import('./pages/AIAssistantPage'))
const SettingsPage      = lazy(() => import('./pages/SettingsPage'))
const LoginPage         = lazy(() => import('./pages/LoginPage'))
const SignupPage        = lazy(() => import('./pages/SignupPage'))

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <div className="w-7 h-7 border-2 border-[#70E0A0] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-[#89978F] tracking-widest uppercase">SYNCHRONIZING FINORA...</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#131D17',
            color: '#F1F5F2',
            border: '1px solid #2A3F33',
            fontSize: '12px',
            borderRadius: '12px',
            fontFamily: 'Inter',
          },
          success: {
            iconTheme: { primary: '#70E0A0', secondary: '#070B09' },
          },
          error: {
            iconTheme: { primary: '#D98989', secondary: '#070B09' },
          },
        }}
      />
      <Routes>
        {/* Landing Page loads instantly */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route path="/login"  element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={<PageLoader />}><SignupPage /></Suspense>} />

        {/* Dashboard Shell with individual Suspense */}
        <Route element={<AppShell />}>
          <Route path="/dashboard"     element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
          <Route path="/expenses"      element={<Suspense fallback={<PageLoader />}><ExpensesPage /></Suspense>} />
          <Route path="/subscriptions" element={<Suspense fallback={<PageLoader />}><SubscriptionsPage /></Suspense>} />
          <Route path="/budget"        element={<Suspense fallback={<PageLoader />}><BudgetPage /></Suspense>} />
          <Route path="/analytics"     element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
          <Route path="/ai"            element={<Suspense fallback={<PageLoader />}><AIAssistantPage /></Suspense>} />
          <Route path="/settings"      element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
