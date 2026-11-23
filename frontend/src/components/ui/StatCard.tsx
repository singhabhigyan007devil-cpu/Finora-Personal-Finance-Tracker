import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import Card from './Card'

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  icon: LucideIcon
  trend?: { value: number; positive: boolean }
  index?: number
  tone?: 'default' | 'positive' | 'negative'
}

export default function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  index = 0,
  tone = 'default'
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: 'easeOut' }}
    >
      <Card hover spatial className="flex items-start justify-between gap-4 group">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1 h-1 rounded-full bg-[#70E0A0]/60 group-hover:bg-[#70E0A0] transition-colors" />
            <p className="text-[10px] font-semibold text-[#89978F] uppercase tracking-wider font-mono">{label}</p>
          </div>
          <p className="text-2xl font-bold text-[#F1F5F2] font-heading tabular-nums tracking-tight truncate group-hover:text-white transition-colors">{value}</p>
          {subValue && <p className="text-xs text-[#89978F] mt-1.5 font-normal truncate">{subValue}</p>}
          {trend && (
            <p className={clsx(
              'text-xs font-semibold mt-1.5 tabular-nums flex items-center gap-1 font-mono',
              trend.positive ? 'text-[#70E0A0]' : 'text-[#D98989]'
            )}>
              <span>{trend.positive ? '▲' : '▼'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-[#89978F] font-normal text-[11px]">vs last month</span>
            </p>
          )}
        </div>
        <div className={clsx(
          'p-2.5 rounded-xl border flex-shrink-0 transition-all duration-200 group-hover:scale-105',
          tone === 'positive'
            ? 'bg-[#70E0A0]/10 border-[#70E0A0]/25 text-[#70E0A0] shadow-[0_0_12px_rgba(112,224,160,0.15)]'
            : tone === 'negative'
            ? 'bg-[#D98989]/10 border-[#D98989]/25 text-[#D98989]'
            : 'bg-[#1B2920] border-[#1F2E25] text-[#A3FFD0]'
        )}>
          <Icon size={18} />
        </div>
      </Card>
    </motion.div>
  )
}
