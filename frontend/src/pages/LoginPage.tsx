import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { isAuthenticated, login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('aryan@finora.io')
  const [password, setPassword] = useState('demo1234')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please enter valid credentials'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    login(email.split('@')[0].replace(/[^a-zA-Z ]/g, ' ') || 'Aryan Patel', email)
    toast.success('Session authenticated')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#070B09] flex items-center justify-center p-6 text-[#F1F5F2] future-grid">
      <div className="w-full max-w-sm">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div className="bg-[#131D17] rounded-2xl p-7 border border-[#1F2E25] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(112,224,160,0.1)] spatial-panel">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center shadow-[0_0_10px_rgba(112,224,160,0.2)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0] animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-sm font-heading tracking-widest text-[#F1F5F2] uppercase">FINORA</h1>
                <p className="text-[9px] text-[#89978F] uppercase font-mono">Secure Finance Portal</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#F1F5F2] font-heading mb-1">Welcome Back</h2>
            <p className="text-xs text-[#89978F] mb-6 font-mono">Log in to manage your finances securely.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89978F]" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] focus:shadow-[0_0_12px_rgba(112,224,160,0.2)] font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Passkey</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89978F]" />
                  <input
                    type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl pl-9 pr-9 py-2.5 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] focus:shadow-[0_0_12px_rgba(112,224,160,0.2)] font-mono"
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89978F] hover:text-[#F1F5F2] cursor-pointer"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <Button type="submit" size="md" className="w-full mt-2" loading={loading} icon={<ArrowRight size={14} />}>
                Authenticate Session
              </Button>
            </form>

            <p className="text-center text-xs text-[#89978F] mt-6 font-mono">
              New client?{' '}
              <Link to="/signup" className="text-[#70E0A0] hover:underline font-medium">Establish Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
