import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Target } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Budget, CATEGORIES, CATEGORY_COLORS } from '../data/mockData'
import { formatCurrency } from '../utils/format'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ProgressBar from '../components/ui/ProgressBar'
import Badge from '../components/ui/Badge'
import toast from 'react-hot-toast'

const EMPTY: Omit<Budget, 'id'> = { category: 'Software & Cloud', limit: 50000, spent: 0, color: '#70E0A0' }

export default function BudgetPage() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useStore()
  const [modalOpen, setModalOpen]   = useState(false)
  const [editBudget, setEditBudget] = useState<Budget | null>(null)
  const [form, setForm]             = useState(EMPTY)
  const [deleteId, setDeleteId]     = useState<string | null>(null)
  const [loading, setLoading]       = useState(false)

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const overBudget = budgets.filter(b => b.spent > b.limit)

  const openAdd = () => { setEditBudget(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (b: Budget) => { setEditBudget(b); setForm({ category: b.category, limit: b.limit, spent: b.spent, color: b.color }); setModalOpen(true) }

  const handleSave = async () => {
    if (!form.limit) { toast.error('Establish a valid ceiling'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 200))
    const color = CATEGORY_COLORS[form.category] || '#70E0A0'
    if (editBudget) { updateBudget(editBudget.id, { ...form, color }); toast.success('Budget ceiling revised') }
    else { addBudget({ ...form, color }); toast.success('Budget target established') }
    setLoading(false); setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2E25]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]" />
            <span className="text-[10px] font-mono text-[#A3FFD0] tracking-widest uppercase">CAPITAL CEILING MATRIX</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] font-heading tracking-tight">Budgets & Savings Targets</h1>
          <p className="text-xs text-[#89978F] mt-0.5 font-mono">Category spending ceilings with proactive variance protection</p>
        </div>
        <Button size="sm" onClick={openAdd} icon={<Plus size={13} />}>Establish Ceiling</Button>
      </div>

      {/* Overview Aggregates */}
      <div className="grid grid-cols-3 gap-4">
        <Card spatial className="text-center py-4">
          <p className="text-[10px] text-[#89978F] uppercase font-mono tracking-wider">Authorized Limit</p>
          <p className="text-lg font-bold text-[#70E0A0] font-heading tabular-nums mt-1">{formatCurrency(totalLimit)}</p>
        </Card>
        <Card spatial className="text-center py-4">
          <p className="text-[10px] text-[#89978F] uppercase font-mono tracking-wider">Consumed Outflow</p>
          <p className={`text-lg font-bold font-heading tabular-nums mt-1 ${totalSpent > totalLimit ? 'text-[#D98989]' : 'text-[#F1F5F2]'}`}>
            {formatCurrency(totalSpent)}
          </p>
        </Card>
        <Card spatial className="text-center py-4">
          <p className="text-[10px] text-[#89978F] uppercase font-mono tracking-wider">Breached Ceilings</p>
          <p className={`text-lg font-bold font-heading tabular-nums mt-1 ${overBudget.length > 0 ? 'text-[#D98989]' : 'text-[#70E0A0]'}`}>
            {overBudget.length} {overBudget.length === 1 ? 'category' : 'categories'}
          </p>
        </Card>
      </div>

      {/* Savings Goal Callout Banner */}
      <Card elevated spatial className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#2A3F33]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#131D17] border border-[#1F2E25] flex items-center justify-center text-[#70E0A0] flex-shrink-0 shadow-[0_0_12px_rgba(112,224,160,0.15)]">
            <Target size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F2] font-heading">Emergency Fund & Savings Goal</h3>
            <p className="text-xs text-[#89978F] mt-0.5 font-mono">Goal: Save at least ₹75,000 this month toward your emergency fund.</p>
          </div>
        </div>
        <Badge variant="hologram">ON TRACK (+₹75,495 MTD)</Badge>
      </Card>

      {/* Category Budgets Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b, i) => {
          const pct = (b.spent / (b.limit || 1)) * 100
          const over = b.spent > b.limit
          const warn = pct >= 80 && !over
          return (
            <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card hover spatial className={`border ${over ? 'border-[#D98989]/50' : warn ? 'border-[#D4A373]/50' : 'border-[#1F2E25]'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color || '#70E0A0' }} />
                      <h3 className="font-bold text-xs text-[#F1F5F2] font-heading">{b.category}</h3>
                    </div>
                    <Badge variant={over ? 'danger' : warn ? 'warning' : 'success'} size="sm">
                      {over ? 'Limit Breached' : warn ? 'Critical (≥80%)' : 'Healthy'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="p-1 rounded-lg text-[#89978F] hover:text-[#70E0A0] transition-colors cursor-pointer"><Pencil size={12} /></button>
                    <button onClick={() => setDeleteId(b.id)} className="p-1 rounded-lg text-[#89978F] hover:text-[#D98989] transition-colors cursor-pointer"><Trash2 size={12} /></button>
                  </div>
                </div>
                <div className="mb-3 font-mono">
                  <div className="flex justify-between text-[10px] text-[#89978F] mb-1.5 tabular-nums">
                    <span>{formatCurrency(b.spent)} consumed</span>
                    <span>{formatCurrency(b.limit)} ceiling</span>
                  </div>
                  <ProgressBar value={pct} color={b.color || '#70E0A0'} size="md" />
                </div>
                <p className={`text-[11px] tabular-nums font-mono ${over ? 'text-[#D98989]' : 'text-[#89978F]'}`}>
                  {over ? `${formatCurrency(b.spent - b.limit)} over authorized ceiling` : `${formatCurrency(b.limit - b.spent)} available headroom`}
                </p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editBudget ? 'Modify Budget Ceiling' : 'Establish Budget'}>
        <div className="space-y-4 font-mono">
          <div>
            <label className="text-[10px] text-[#89978F] uppercase tracking-wider block mb-1.5">Category</label>
            <select
              value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0]"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-[#89978F] uppercase tracking-wider block mb-1.5">Monthly Ceiling (₹) *</label>
            <input
              type="number" value={form.limit || ''} onChange={e => setForm(f => ({ ...f, limit: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g. 50000"
              className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#89978F] uppercase tracking-wider block mb-1.5">Recorded Spend So Far (₹)</label>
            <input
              type="number" value={form.spent || ''} onChange={e => setForm(f => ({ ...f, spent: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
              className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0]"
            />
          </div>
          <div className="flex gap-3 pt-3">
            <Button variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} loading={loading}>{editBudget ? 'Save' : 'Establish'}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Budget" size="sm">
        <p className="text-xs text-[#89978F] mb-6 leading-relaxed font-mono">
          Remove this category ceiling? Variance tracking for this category will cease.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={() => { if (deleteId) { deleteBudget(deleteId); toast.success('Budget deleted'); setDeleteId(null) } }}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
