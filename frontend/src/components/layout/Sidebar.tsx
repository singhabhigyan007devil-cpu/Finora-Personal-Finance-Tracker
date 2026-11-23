import { NavLink, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, CreditCard, Repeat, Bot, BarChart2,
  Wallet, Settings, LogOut, X, Globe
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { clsx } from 'clsx'

const NAV = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Overview' },
  { to: '/expenses',       icon: CreditCard,       label: 'Transactions' },
  { to: '/subscriptions',  icon: Repeat,           label: 'Subscriptions' },
  { to: '/budget',         icon: Wallet,           label: 'Budgets & Goals' },
  { to: '/analytics',      icon: BarChart2,        label: 'Analytics' },
  { to: '/ai',             icon: Bot,              label: 'AI Assistant' },
  { to: '/settings',       icon: Settings,         label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, user, logout } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-[#070B09]/80 backdrop-blur-sm z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={clsx(
          'fixed top-0 left-0 h-full z-30 flex flex-col bg-[#0D1410] border-r border-[#1F2E25]',
          'transition-all duration-200 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-18',
          'lg:relative lg:flex'
        )}
      >
        {/* Clickable Brand -> Returns to Landing Page */}
        <Link
          to="/"
          title="Return to Landing Page"
          className="flex items-center gap-3 p-4 h-16 border-b border-[#1F2E25] hover:bg-[#131D17] transition-all group cursor-pointer"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center group-hover:border-[#70E0A0] transition-colors shadow-[0_0_12px_rgba(112,224,160,0.15)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#70E0A0] shadow-[0_0_10px_#70E0A0] animate-pulse" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm font-heading tracking-widest text-[#F1F5F2] uppercase group-hover:text-[#A3FFD0] transition-colors">FINORA</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#70E0A0]/10 text-[#70E0A0] border border-[#70E0A0]/25 font-mono">v4.2</span>
                </div>
                <span className="text-[9px] text-[#89978F] tracking-wider uppercase font-mono group-hover:text-[#70E0A0] transition-colors flex items-center gap-1">
                  <span>●</span> <span>Return to Home</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="ml-auto text-[#89978F] hover:text-[#F1F5F2] transition-colors lg:hidden cursor-pointer"
            onClick={(e) => { e.preventDefault(); setSidebarOpen(!sidebarOpen) }}
          >
            <X size={18} />
          </button>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1.5 px-2.5 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group relative',
                isActive
                  ? 'bg-[#1B2920] text-[#F1F5F2] border border-[#2A3F33] shadow-[0_0_16px_rgba(112,224,160,0.08)]'
                  : 'text-[#89978F] hover:text-[#F1F5F2] hover:bg-[#131D17]'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 w-1 h-5 rounded-r bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]"
                    />
                  )}
                  <Icon
                    size={16}
                    className={clsx(
                      'flex-shrink-0 transition-colors',
                      isActive ? 'text-[#70E0A0]' : 'text-[#89978F] group-hover:text-[#A3FFD0]'
                    )}
                  />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        className="truncate font-heading tracking-wide"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}

          {/* Explicit Landing Page return link */}
          <div className="pt-3 mt-3 border-t border-[#1F2E25]">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#AEBBB4] hover:text-[#A3FFD0] hover:bg-[#131D17] border border-transparent hover:border-[#1F2E25] transition-all group"
            >
              <Globe size={16} className="text-[#70E0A0] flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    className="truncate flex items-center justify-between w-full font-mono text-[11px]"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                  >
                    <span>Public Landing Page</span>
                    <span className="text-[10px] text-[#89978F] group-hover:text-[#70E0A0]">↗</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </nav>

        {/* Telemetry pill */}
        {sidebarOpen && (
          <div className="px-3 py-2 mx-2 mb-2 rounded-xl bg-[#131D17] border border-[#1F2E25] flex items-center justify-between">
            <span className="text-[9px] font-mono text-[#89978F] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70E0A0] shadow-[0_0_6px_#70E0A0]" />
              MCP NODE 12ms
            </span>
            <span className="text-[9px] font-mono text-[#A3FFD0]">AES-GCM</span>
          </div>
        )}

        {/* User & Logout */}
        <div className="p-3 border-t border-[#1F2E25] space-y-2">
          {sidebarOpen && user && (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center text-[#70E0A0] text-[11px] font-bold flex-shrink-0">
                {user.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#F1F5F2] truncate font-heading">{user.name}</p>
                <p className="text-[10px] text-[#89978F] truncate font-mono">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-[#89978F] hover:text-[#D98989] hover:bg-[#D98989]/10 transition-colors cursor-pointer font-mono"
          >
            <LogOut size={15} className="flex-shrink-0" />
            {sidebarOpen && <span>Disconnect Session</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
