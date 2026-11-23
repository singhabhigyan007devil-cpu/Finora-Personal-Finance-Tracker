import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'
import { CATEGORY_COLORS, Transaction } from '../../data/mockData'
import Card from '../ui/Card'
import { currentMonthTransactions, formatCurrency } from '../../utils/format'

export default function CategoryDonut({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    const expenses = currentMonthTransactions(transactions).filter(t => t.type === 'expense')
    const totals: Record<string, number> = {}
    expenses.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount })
    return Object.entries(totals).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const total = useMemo(() => data.reduce((s, c) => s + c.value, 0), [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#1B2920] rounded-xl px-3 py-2 border border-[#2A3F33] shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-xs font-mono">
        <p className="text-[#89978F]">{payload[0].name}</p>
        <p className="font-bold text-[#F1F5F2] tabular-nums mt-0.5 text-sm">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }

  return (
    <Card spatial className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A3FFD0] shadow-[0_0_8px_#A3FFD0]" />
          <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Spending by Category</h3>
        </div>
        <span className="text-[10px] text-[#A3FFD0] font-mono px-2 py-0.5 rounded bg-[#1B2920] border border-[#2A3F33]">
          {data.length} CATEGORIES
        </span>
      </div>
      <div className="relative h-60 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={62} outerRadius={86} paddingAngle={3} dataKey="value">
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#70E0A0'} stroke="#0D1410" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[9px] text-[#89978F] uppercase tracking-widest font-mono">Total Outflow</span>
          <span className="text-sm font-bold text-[#F1F5F2] font-heading tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>
    </Card>
  )
}
