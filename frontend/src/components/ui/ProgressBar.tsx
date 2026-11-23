import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  color?: string
  size?: 'sm' | 'md'
  showLabel?: boolean
  label?: string
}

export default function ProgressBar({ value, color = '#70E0A0', size = 'sm', showLabel = false, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))
  const isOver = value > 100
  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-[#89978F] font-mono">{label}</span>}
          {showLabel && (
            <span className={clsx('text-xs font-semibold tabular-nums font-mono', isOver ? 'text-[#D98989]' : 'text-[#A3FFD0]')}>
              {Math.round(value)}%
            </span>
          )}
        </div>
      )}
      <div className={clsx('w-full bg-[#1B2920] rounded-full overflow-hidden border border-[#1F2E25]', size === 'sm' ? 'h-1.5' : 'h-2')}>
        <motion.div
          className="h-full rounded-full transition-all duration-300"
          style={{
            backgroundColor: isOver ? '#D98989' : color,
            boxShadow: isOver ? '0 0 10px rgba(217,137,137,0.5)' : `0 0 12px ${color}66`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
