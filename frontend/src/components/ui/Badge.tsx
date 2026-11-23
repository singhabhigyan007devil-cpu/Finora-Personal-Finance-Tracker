import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral' | 'hologram'
  size?: 'sm' | 'md'
}

const VARIANTS = {
  default:  'bg-[#1B2920] text-[#89978F] border-[#1F2E25]',
  success:  'bg-[#70E0A0]/10 text-[#70E0A0] border-[#70E0A0]/25 shadow-[0_0_10px_rgba(112,224,160,0.1)]',
  warning:  'bg-[#D4A373]/10 text-[#D4A373] border-[#D4A373]/25',
  danger:   'bg-[#D98989]/10 text-[#D98989] border-[#D98989]/25',
  neutral:  'bg-[#131D17] text-[#AEBBB4] border-[#1F2E25]',
  hologram: 'bg-[#70E0A0]/15 text-[#A3FFD0] border-[#70E0A0]/40 shadow-[0_0_12px_rgba(112,224,160,0.2)]',
}

export default function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center font-medium rounded-full border tabular-nums font-mono',
      size === 'sm' ? 'px-2.5 py-0.5 text-[10px] tracking-wider' : 'px-3 py-1 text-xs tracking-wide',
      VARIANTS[variant],
    )}>
      {children}
    </span>
  )
}
