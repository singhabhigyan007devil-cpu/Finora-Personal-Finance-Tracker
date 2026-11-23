import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Download, Pencil, Trash2, ArrowDownRight, ArrowUpRight, Filter } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATEGORIES, Transaction } from '../data/mockData'
import { formatCurrency, formatDate } from '../utils/format'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import toast from 'react-hot-toast'

const EMPTY: Omit<Transaction, 'id'> = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: 0,
  type: 'expense',
  category: 'Software & Cloud',
}

export default function ExpensesPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useStore()
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTx, setEditTx]       = useState<Transaction | null>(null)
  const [form, setForm]           = useState(EMPTY)
  const [deleteId, setDeleteId]   = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)

  const filtered = useMemo(() => {
    return transactions
      .filter(t => catFilter === 'All' || t.category === catFilter)
      .filter(t => typeFilter === 'All' || t.type === typeFilter)
      .filter(t => t.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, search, catFilter, typeFilter])

  const totals = useMemo(() => {
    const income   = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expenses, balance: income - expenses }
  }, [filtered])

  const openAdd = () => { setEditTx(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (tx: Transaction) => {
    setEditTx(tx)
    setForm({ date: tx.date, description: tx.description, amount: tx.amount, type: tx.type, category: tx.category })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.description || !form.amount || !form.date) { toast.error('Required fields missing'); return }
    if (form.amount <= 0) { toast.error('Amount must exceed zero'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 200))
    if (editTx) {
      updateTransaction(editTx.id, form)
      toast.success('Ledger record updated')
    } else {
      addTransaction(form)
      toast.success('Transaction documented')
    }
    setLoading(false)
    setModalOpen(false)
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteTransaction(deleteId)
    toast.success('Record purged')
    setDeleteId(null)
  }

  const exportCSV = () => {
    const headers = 'Date,Description,Category,Type,Amount'
    const rows = filtered.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join('\n')
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `future-vault-ledger-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    toast.success('CSV ledger export generated')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2E25]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]" />
            <span className="text-[10px] font-mono text-[#A3FFD0] tracking-widest uppercase">TRANSACTION HISTORY</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] font-heading tracking-tight">Transactions & Expenses</h1>
          <p className="text-xs text-[#89978F] mt-0.5 font-mono">Track, search, and manage all your income and expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} icon={<Download size={13} />}>Export CSV</Button>
          <Button size="sm" onClick={openAdd} icon={<Plus size={13} />}>Add Transaction</Button>
        </div>
      </div>

      {/* Aggregate metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card spatial className="text-center py-4">
          <p className="text-[10px] text-[#89978F] uppercase font-mono tracking-wider">Filtered Inflow</p>
          <p className="text-lg font-bold text-[#70E0A0] font-heading tabular-nums mt-1">{formatCurrency(totals.income)}</p>
        </Card>
        <Card spatial className="text-center py-4">
          <p className="text-[10px] text-[#89978F] uppercase font-mono tracking-wider">Filtered Outflow</p>
          <p className="text-lg font-bold text-[#D98989] font-heading tabular-nums mt-1">{formatCurrency(totals.expenses)}</p>
        </Card>
        <Card spatial className="text-center py-4">
          <p className="text-[10px] text-[#89978F] uppercase font-mono tracking-wider">Net Cycle Delta</p>
          <p className={`text-lg font-bold font-heading tabular-nums mt-1 ${totals.balance >= 0 ? 'text-[#70E0A0]' : 'text-[#D98989]'}`}>
            {formatCurrency(totals.balance)}
          </p>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card padding="sm" spatial className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89978F]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search records by merchant or narrative…"
            className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F1F5F2] placeholder-[#89978F]/60 focus:outline-none focus:border-[#70E0A0] transition-colors font-mono"
          />
        </div>
        <select
          value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] cursor-pointer font-mono"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] cursor-pointer font-mono"
        >
          <option value="All">All Movements</option>
          <option value="income">Inflow Only</option>
          <option value="expense">Outflow Only</option>
        </select>
        <span className="text-xs text-[#A3FFD0] font-mono ml-auto tabular-nums">{filtered.length} entries</span>
      </Card>

      {/* Transaction List */}
      <Card padding="none" spatial className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Filter size={28} className="text-[#89978F]/40 mx-auto mb-2" />
            <p className="text-xs text-[#89978F] font-medium font-mono">No ledger records matching current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1F2E25]">
            {filtered.map((tx, i) => (
              <motion.div
                key={tx.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#1B2920]/50 transition-colors group"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              >
                <div className="w-8 h-8 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center flex-shrink-0 group-hover:border-[#70E0A0] transition-colors">
                  {tx.type === 'income' ? (
                    <ArrowDownRight size={14} className="text-[#70E0A0]" />
                  ) : (
                    <ArrowUpRight size={14} className="text-[#D98989]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#F1F5F2] truncate font-heading group-hover:text-white transition-colors">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#89978F]">
                    <span className="font-mono">{formatDate(tx.date)}</span>
                    <span>•</span>
                    <Badge variant="default" size="sm">{tx.category}</Badge>
                  </div>
                </div>
                <span className={`text-xs font-bold font-heading tabular-nums ${
                  tx.type === 'income' ? 'text-[#70E0A0]' : 'text-[#F1F5F2]'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(tx)}
                    className="p-1.5 rounded-lg text-[#89978F] hover:text-[#70E0A0] hover:bg-[#1B2920] transition-colors cursor-pointer"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => setDeleteId(tx.id)}
                    className="p-1.5 rounded-lg text-[#89978F] hover:text-[#D98989] hover:bg-[#1B2920] transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTx ? 'Edit Ledger Record' : 'Record Transaction'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Flow Direction</label>
              <select
                value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
              >
                <option value="expense">Outflow (Expense)</option>
                <option value="income">Inflow (Income)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Category</label>
              <select
                value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Narrative / Counterparty *</label>
            <input
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g. AWS Dedicated Cloud Core"
              className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] placeholder-[#89978F]/50 focus:outline-none focus:border-[#70E0A0] font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Amount (₹) *</label>
              <input
                type="number" value={form.amount || ''} onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#89978F] uppercase tracking-wider font-mono block mb-1.5">Execution Date *</label>
              <input
                type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-[#0D1410] border border-[#1F2E25] rounded-xl px-3 py-2 text-xs text-[#F1F5F2] focus:outline-none focus:border-[#70E0A0] font-mono"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <Button variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} loading={loading}>{editTx ? 'Update Entry' : 'Commit Entry'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Record Deletion" size="sm">
        <p className="text-xs text-[#89978F] mb-6 leading-relaxed font-mono">
          Are you sure you want to permanently purge this accounting entry from the ledger? This operation is irreversible.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Purge Record</Button>
        </div>
      </Modal>
    </div>
  )
}
