import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Info, Lightbulb } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '../store/useStore'
import { currentMonthTransactions, formatCurrency } from '../utils/format'
import { monthlySpendingData, CATEGORY_COLORS } from '../data/mockData'
import Card from '../components/ui/Card'

export default function AnalyticsPage() {
  const { transactions, subscriptions, budgets } = useStore()

  const insights = useMemo(() => {
    const current  = currentMonthTransactions(transactions)
    const expenses = current.filter(t => t.type === 'expense')
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0)
    const catTotals: Record<string, number> = {}
    expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount })

    const prevMonth = transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === 9 && d.getFullYear() === 2026 && t.type === 'expense'
    })
    const prevCatTotals: Record<string, number> = {}
    prevMonth.forEach(t => { prevCatTotals[t.category] = (prevCatTotals[t.category] || 0) + t.amount })

    const result: Array<{ type: 'warning' | 'info' | 'success', text: string }> = []

    Object.entries(catTotals).forEach(([cat, amt]) => {
      const prev = prevCatTotals[cat] || 0
      if (prev > 0) {
        const pct = ((amt - prev) / prev * 100).toFixed(0)
        if (amt > prev * 1.1) {
          result.push({ type: 'warning', text: `${cat} outlays increased by ${pct}% this cycle (${formatCurrency(amt)} vs ${formatCurrency(prev)})` })
        }
      }
    })

    const activeSubs = subscriptions.filter(s => s.status === 'active')
    const thisWeek = activeSubs.filter(s => {
      const d = Math.ceil((new Date(s.nextRenewal).getTime() - Date.now()) / 86400000)
      return d >= 0 && d <= 7
    })
    if (thisWeek.length > 0) {
      result.push({ type: 'info', text: `${thisWeek.length} recurring commitment renewal${thisWeek.length > 1 ? 's' : ''} scheduled within 7 calendar days: ${thisWeek.map(s => s.name).join(', ')}` })
    }

    const overBudget = budgets.filter(b => b.spent > b.limit)
    overBudget.forEach(b => {
      result.push({ type: 'warning', text: `${b.category} expenditures (${formatCurrency(b.spent)}) exceeded target ceiling of ${formatCurrency(b.limit)}` })
    })

    const subCost = activeSubs.reduce((s, sub) => s + sub.amount, 0)
    if (totalExp > 0 && subCost / totalExp > 0.1) {
      result.push({ type: 'info', text: `Recurring subscriptions represent ${((subCost / totalExp) * 100).toFixed(1)}% of all November outflows.` })
    }

    if (result.length === 0) {
      result.push({ type: 'success', text: 'All financial parameters are operating within established tolerance bands.' })
    }
    return result
  }, [transactions, subscriptions, budgets])

  const catData = useMemo(() => {
    const expenses = currentMonthTransactions(transactions).filter(t => t.type === 'expense')
    const totals: Record<string, number> = {}
    expenses.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount })
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const totalExp = catData.reduce((s, c) => s + c.value, 0)

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#1F2E25]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]" />
          <span className="text-[10px] font-mono text-[#A3FFD0] tracking-widest uppercase">SPENDING TRENDS & INSIGHTS</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F1F5F2] font-heading tracking-tight">Financial Trends & Insights</h1>
        <p className="text-xs text-[#89978F] mt-0.5 font-mono">Track your monthly spending trends, anomalies, and category breakdown</p>
      </div>

      <Card spatial>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} className="text-[#70E0A0]" />
          <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Smart Spending Alerts</h3>
        </div>
        <div className="space-y-2.5">
          {insights.map((ins, i) => (
            <motion.div
              key={i}
              className={`flex gap-3 p-3 rounded-xl border ${
                ins.type === 'warning'
                  ? 'bg-[#D98989]/10 border-[#D98989]/25 text-[#D98989]'
                  : ins.type === 'success'
                  ? 'bg-[#70E0A0]/10 border-[#70E0A0]/25 text-[#70E0A0]'
                  : 'bg-[#1B2920] border-[#1F2E25] text-[#89978F]'
              }`}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            >
              {ins.type === 'warning' ? <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" /> : ins.type === 'success' ? <TrendingUp size={15} className="flex-shrink-0 mt-0.5" /> : <Info size={15} className="flex-shrink-0 mt-0.5" />}
              <p className="text-xs leading-relaxed font-mono">{ins.text}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card spatial>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">6-Month Expenditure Velocity</h3>
            <p className="text-xs text-[#89978F] font-mono">Continuous outflow trajectory curve</p>
          </div>
          <span className="text-[10px] text-[#A3FFD0] font-mono px-2 py-0.5 rounded bg-[#1B2920] border border-[#2A3F33]">Jun – Nov 2026</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySpendingData}>
              <defs>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#70E0A0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#70E0A0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2E25" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#89978F', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#89978F', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Outflow']}
                contentStyle={{ background: '#1B2920', border: '1px solid #2A3F33', borderRadius: 12, fontSize: 11, color: '#F1F5F2', fontFamily: 'JetBrains Mono' }}
              />
              <Area type="monotone" dataKey="expenses" stroke="#70E0A0" fill="url(#colorExp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card spatial>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Categorical Capital Allocation</h3>
          <span className="text-[10px] text-[#A3FFD0] font-mono tabular-nums px-2.5 py-0.5 rounded bg-[#1B2920] border border-[#2A3F33]">{formatCurrency(totalExp)} Total</span>
        </div>
        <div className="space-y-3.5">
          {catData.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#70E0A0' }} />
                  <span className="text-[#F1F5F2]">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-[#89978F]">{((cat.value / (totalExp || 1)) * 100).toFixed(1)}%</span>
                  <span className="font-semibold text-[#F1F5F2]">{formatCurrency(cat.value)}</span>
                </div>
              </div>
              <div className="h-1.5 bg-[#1B2920] rounded-full overflow-hidden border border-[#1F2E25]">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: CATEGORY_COLORS[cat.name] || '#70E0A0',
                    boxShadow: `0 0 10px ${(CATEGORY_COLORS[cat.name] || '#70E0A0')}66`
                  }}
                  initial={{ width: 0 }} animate={{ width: `${(cat.value / (totalExp || 1) * 100).toFixed(1)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
