import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, LogOut, Save, Server, Lock } from 'lucide-react'
import { useStore } from '../store/useStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const { user, logout } = useStore()
  const navigate = useNavigate()
  const [name, setName]   = useState(user?.name || 'Aryan Patel')
  const [email, setEmail] = useState(user?.email || 'aryan@finora.io')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    setSaving(false)
    toast.success('Configuration committed')
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4 border-b border-[#1F2E25]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]" />
          <span className="text-[10px] font-mono text-[#A3FFD0] tracking-widest uppercase">PREFERENCES & SETTINGS</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F1F5F2] font-heading tracking-tight">Settings & Integrations</h1>
        <p className="text-xs text-[#89978F] mt-0.5 font-mono">Manage your account profile, notification alerts, and Model Context Protocol setup</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card spatial>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-[#70E0A0]" />
            <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Identity Profile</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center text-sm font-bold text-[#70E0A0] font-heading shadow-[0_0_12px_rgba(112,224,160,0.15)]">
                {user?.avatar || 'AP'}
              </div>
              <div>
                <p className="text-sm font-bold text-[#F1F5F2] font-heading">{name}</p>
                <p className="text-xs text-[#89978F] font-mono">{email}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Operator Name</label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Corporate Email</label>
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
        <Card spatial>
          <div className="flex items-center gap-2 mb-3">
            <Server size={16} className="text-[#70E0A0]" />
            <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Model Context Protocol (MCP) Interface</h3>
          </div>
          <p className="text-xs text-[#89978F] leading-relaxed mb-3 font-mono">
            Standardized stdio communication interface enabling LLMs (Claude, Gemini, OpenAI) to audit client finances through verified tools.
          </p>
          <div className="p-3 bg-[#0D1410] rounded-xl border border-[#1F2E25] font-mono text-[11px] space-y-1">
            <p className="text-[#89978F]">// Active Transport Configuration</p>
            <p className="text-[#70E0A0]">COMMAND: node mcp-server/dist/index.js</p>
            <p className="text-[#A3FFD0]">TRANSPORT: stdio (Standard Input / Output)</p>
            <p className="text-[#AEBBB4]">REGISTERED TOOLS: 7 Tools Active</p>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Card spatial>
          <div className="flex items-center gap-2 mb-3">
            <Lock size={16} className="text-[#70E0A0]" />
            <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Institutional Security Parameters</h3>
          </div>
          <p className="text-xs text-[#89978F] leading-relaxed font-mono">
            Client data is encrypted locally using AES-256 standard browser persistence. No financial data leaves this node.
          </p>
        </Card>
      </motion.div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="danger" size="sm" onClick={handleLogout} icon={<LogOut size={13} />}>
          Disconnect Session
        </Button>
        <Button size="sm" onClick={save} loading={saving} icon={<Save size={13} />}>
          Commit Configuration
        </Button>
      </div>
    </div>
  )
}
