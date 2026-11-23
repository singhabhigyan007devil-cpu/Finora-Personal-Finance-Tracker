import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { monthlySpendingData } from '../../data/mockData'
import Card from '../ui/Card'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1B2920] rounded-xl p-3 border border-[#2A3F33] shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-xs">
      <p className="font-semibold text-[#F1F5F2] font-heading mb-1.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#70E0A0]" />
        CYCLE {label} 2026
      </p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <span className="text-[#89978F] flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
            {p.name}
          </span>
          <span className="font-semibold text-[#F1F5F2] tabular-nums font-mono">₹{p.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  )
}

export default function SpendingBar() {
  return (
    <Card spatial className="lg:col-span-2 group">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]" />
            <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Income vs. Expenses</h3>
          </div>
          <p className="text-xs text-[#89978F] mt-0.5 font-mono">Monthly overview of earnings and spending over the last 6 months</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B2920] text-[#A3FFD0] border border-[#2A3F33]">
          LAST 6 MONTHS
        </span>
      </div>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySpendingData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2E25" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#89978F', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#89978F', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: '#89978F', paddingTop: '10px', fontFamily: 'JetBrains Mono' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="income" fill="#70E0A0" radius={[4, 4, 0, 0]} name="Inflow Velocity" />
            <Bar dataKey="expenses" fill="#D98989" radius={[4, 4, 0, 0]} name="Outflow Drain" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
