import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Subscription } from '../../data/mockData'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/format'

export default function SubscriptionBreakdown({ subscriptions }: { subscriptions: Subscription[] }) {
  const data = subscriptions
    .filter(s => s.status === 'active')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)
    .map(s => ({ name: s.name, amount: s.amount, color: s.color }))

  return (
    <Card spatial>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]" />
          <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Committed Recurring Outflow</h3>
        </div>
        <span className="text-[10px] text-[#89978F] font-mono">TOP 6 COMMITMENTS</span>
      </div>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={10}>
            <XAxis type="number" tick={{ fill: '#89978F', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#AEBBB4', fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={120} />
            <Tooltip
              formatter={(v: any) => [formatCurrency(v), 'Monthly Commit']}
              contentStyle={{ background: '#1B2920', border: '1px solid #2A3F33', borderRadius: 12, fontSize: 11, color: '#F1F5F2', fontFamily: 'JetBrains Mono' }}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={index === 0 ? '#70E0A0' : index === 1 ? '#A3FFD0' : index % 2 === 0 ? '#89B8A0' : '#52B788'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
