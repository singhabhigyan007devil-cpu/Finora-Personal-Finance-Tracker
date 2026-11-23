import { Outlet, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Bell, Globe, Shield, Cpu } from 'lucide-react'
import Sidebar from './Sidebar'
import { useStore } from '../../store/useStore'

export default function AppShell() {
  const { isAuthenticated, user, setSidebarOpen, sidebarOpen } = useStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen bg-[#070B09] text-[#F1F5F2] overflow-hidden future-grid">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sleek futuristic command header */}
        <header className="h-16 flex items-center gap-4 px-6 border-b border-[#1F2E25] bg-[#0D1410]/90 backdrop-blur-md flex-shrink-0 z-10">
          <button
            className="lg:hidden text-[#89978F] hover:text-[#F1F5F2] transition-colors cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={18} />
          </button>
          
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0] animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#AEBBB4] tracking-wider uppercase font-semibold">FINORA VAULT</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#70E0A0]/10 text-[#70E0A0] border border-[#70E0A0]/25 font-mono hidden sm:inline">LIVE LEDGER ACTIVE</span>
            </div>
          </div>

          <div className="flex-1" />

          {/* System Status Indicators */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-[#89978F] border-r border-[#1F2E25] pr-4">
            <span className="flex items-center gap-1.5">
              <Cpu size={13} className="text-[#70E0A0]" />
              <span className="text-[#F1F5F2]">99.9%</span> SYSTEM HEALTH
            </span>
            <span className="flex items-center gap-1.5">
              <Shield size={13} className="text-[#A3FFD0]" />
              <span className="text-[#A3FFD0]">AES-256</span> ENCRYPTED
            </span>
          </div>

          {/* Direct "Return to Landing Page" Header Button */}
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131D17] border border-[#1F2E25] hover:border-[#70E0A0] text-[#AEBBB4] hover:text-[#F1F5F2] hover:shadow-[0_0_12px_rgba(112,224,160,0.15)] transition-all text-xs font-medium cursor-pointer"
            title="Return to Landing Page"
          >
            <Globe size={14} className="text-[#70E0A0]" />
            <span className="hidden sm:inline font-mono">Landing Page</span>
            <span className="text-[10px] text-[#70E0A0]">↗</span>
          </Link>

          <button className="relative p-2 rounded-xl text-[#89978F] hover:text-[#F1F5F2] hover:bg-[#1B2920] transition-all cursor-pointer border border-transparent hover:border-[#1F2E25]">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#70E0A0] rounded-full shadow-[0_0_6px_#70E0A0]" />
          </button>

          {user && (
            <div className="w-8 h-8 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center text-[#70E0A0] text-xs font-bold font-heading shadow-[0_0_8px_rgba(112,224,160,0.15)]">
              {user.avatar}
            </div>
          )}
        </header>

        {/* Main scrollable body with subtle perspective */}
        <main className="flex-1 overflow-y-auto bg-[#070B09] spatial-container">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="p-6 max-w-7xl mx-auto space-y-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
