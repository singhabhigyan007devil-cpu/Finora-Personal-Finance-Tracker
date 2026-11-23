import { useState, useMemo } from 'react'
import { Plus, Repeat, Calendar, TrendingDown, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Subscription } from '../data/mockData'
import { formatCurrency, formatDate, daysUntil } from '../utils/format'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import toast from 'react-hot-toast'

const CATEGORIES_SUB = ['Software & Cloud', 'Housing & Utilities', 'Entertainment', 'Shopping', 'Health & Wellness', 'Education', 'Others']
const EMPTY_SUB: Omit<Subscription, 'id'> = {
  name: '', logo: '⚡', amount: 0,
  billingFrequency: 'monthly',
  nextRenewal: new Date().toISOString().split('T')[0],
  category: 'Software & Cloud',
  status: 'active',
  color: '#70E0A0',
}

export default function SubscriptionsPage() {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useStore()
  const [filter, setFilter]   = useState<'all' | 'active' | 'cancelled'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editSub, setEditSub] = useState<Subscription | null>(null)
  const [form, setForm]       = useState(EMPTY_SUB)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const active = subscriptions.filter(s => s.status === 'active')
  const monthlyCost = active.reduce((s, sub) => s + sub.amount, 0)
  const annualCost  = monthlyCost * 12
  const upcoming    = active.filter(s => daysUntil(s.nextRenewal) <= 7 && daysUntil(s.nextRenewal) >= 0)

  const filtered = useMemo(() =>
    subscriptions.filter(s => filter === 'all' || s.status === filter),
  [subscriptions, filter])

  const openAdd  = () => { setEditSub(null); setForm(EMPTY_SUB); setModalOpen(true) }
  const openEdit = (s: Subscription) => {
    setEditSub(s)
    setForm({ name: s.name, logo: s.logo, amount: s.amount, billingFrequency: s.billingFrequency, nextRenewal: s.nextRenewal, category: s.category, status: s.status, color: s.color })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.amount) { toast.error('Name and valid amount required'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 200))
    if (editSub) { updateSubscription(editSub.id, form); toast.success('Subscription terms updated') }
    else { addSubscription(form); toast.success('Recurring service registered') }
    setLoading(false); setModalOpen(false)
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteSubscription(deleteId)
    toast.success('Subscription removed from portfolio')
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2E25]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]" />
            <span className="text-[10px] font-mono text-[#A3FFD0] tracking-widest uppercase">RECURRING COMMITMENTS RADAR</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] font-heading tracking-tight">Recurring Subscriptions</h1>
          <p className="text-xs text-[#89978F] mt-0.5 font-mono">Audit active infrastructure seats, recurring licenses, and cloud contracts</p>
        </div>
        <Button size="sm" onClick={openAdd} icon={<Plus size={13} />}>Add Service</Button>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Repeat,        label: 'Monthly Committed', value: formatCurrency(monthlyCost),   color: 'text-[#70E0A0]' },
          { icon: TrendingDown,  label: 'Annualized Runrate', value: formatCurrency(annualCost),    color: 'text-[#A3FFD0]' },
          { icon: Calendar,      label: 'Active Contracts',  value: `${active.length} services`,    color: 'text-[#F1F5F2]' },
          { icon: AlertTriangle, label: 'Due This Week',     value: `${upcoming.length} renewals`,  color: upcoming.length > 0 ? 'text-[#D98989]' : 'text-[#89978F]' },
        ].map(stat => (
          <Card key={stat.label} spatial className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <stat.icon size={14} className={stat.color} />
              <p className="text-[10px] text-[#89978F] uppercase font-mono tracking-wider">{stat.label}</p>
            </div>
            <p className={`text-xl font-bold font-heading tabular-nums ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 font-mono text-xs">
        {(['all', 'active', 'cancelled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer capitalize ${
              filter === f
                ? 'bg-[#1B2920] border-[#2A3F33] text-[#F1F5F2] shadow-[0_0_12px_rgba(112,224,160,0.1)]'
                : 'bg-[#131D17] border-[#1F2E25] text-[#89978F] hover:text-[#F1F5F2]'
            }`}
          >
            {f} {f === 'all' ? `(${subscriptions.length})` : f === 'active' ? `(${active.length})` : `(${subscriptions.length - active.length})`}
          </button>
        ))}
      </div>

      {/* Subscription Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(sub => {
          const days = daysUntil(sub.nextRenewal)
          const isDueSoon = days <= 7 && days >= 0
          return (
            <Card key={sub.id} hover spatial className="flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center text-xl group-hover:border-[#70E0A0] transition-colors">
                      {sub.logo}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F1F5F2] font-heading group-hover:text-white transition-colors">{sub.name}</h3>
                      <p className="text-[10px] text-[#89978F] font-mono capitalize">{sub.category}</p>
                    </div>
                  </div>
                  <Badge variant={sub.status === 'active' ? 'success' : 'neutral'}>
                    {sub.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 my-3 pt-3 border-t border-[#1F2E25] text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#89978F]">Renewal:</span>
                    <span className={isDueSoon ? 'text-[#D98989] font-semibold' : 'text-[#AEBBB4]'}>
                      {formatDate(sub.nextRenewal)} {isDueSoon ? `(${days}d)` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#89978F]">Cycle:</span>
                    <span className="text-[#AEBBB4] capitalize">{sub.billingFrequency}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1F2E25]">
                <span className="text-base font-bold text-[#F1F5F2] font-heading tabular-nums">
                  {formatCurrency(sub.amount)}
                  <span className="text-[10px] text-[#89978F] font-normal font-mono"> /mo</span>
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(sub)}
                    className="p-1.5 rounded-lg text-[#89978F] hover:text-[#70E0A0] hover:bg-[#1B2920] transition-colors cursor-pointer"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => setDeleteId(sub.id)}
                    className="p-1.5 rounded-lg text-[#89978F] hover:text-[#D98989] hover:bg-[#1B2920] transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editSub ? 'Edit Subscription Terms' : 'Register Subscription'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Service Name *</label>
              <input
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Bloomberg Institutional Terminal"
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Icon / Emoji</label>
              <input
                value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))}
                placeholder="⚡"
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Monthly Cost (₹) *</label>
              <input
                type="number" value={form.amount || ''} onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Renewal Date *</label>
              <input
                type="date" value={form.nextRenewal} onChange={e => setForm(f => ({ ...f, nextRenewal: e.target.value }))}
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Category</label>
              <select
                value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
              >
                {CATEGORIES_SUB.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Contract Status</label>
              <select
                value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <Button variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} loading={loading}>{editSub ? 'Update Terms' : 'Register Service'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Revoke Subscription Registration" size="sm">
        <p className="text-xs text-[#89978F] mb-6 leading-relaxed font-mono">
          Are you sure you want to remove this recurring commitment from the tracking radar? Historical transactions will remain preserved in the ledger.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Revoke Service</Button>
        </div>
      </Modal>
    </div>
  )
}
