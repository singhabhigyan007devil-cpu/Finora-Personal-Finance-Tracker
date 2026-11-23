import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'hologram'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const VARIANTS = {
  // Primary emerald action with subtle holographic sheen
  primary:   'bg-[#70E0A0] hover:bg-[#86E8AF] text-[#070B09] font-bold border border-[#70E0A0] shadow-[0_0_20px_-3px_rgba(112,224,160,0.3)]',
  // Holographic futuristic mint
  hologram:  'bg-[#131D17] hover:bg-[#1B2920] text-[#A3FFD0] font-semibold border border-[#70E0A0]/40 shadow-[0_0_16px_rgba(112,224,160,0.15)] hover:border-[#70E0A0]',
  // Elevated dark metallic surface
  secondary: 'bg-[#1B2920] hover:bg-[#23352A] text-[#F1F5F2] border border-[#2A3F33]',
  // Rose negative indicator
  danger:    'bg-[#D98989]/15 hover:bg-[#D98989]/25 text-[#D98989] border border-[#D98989]/30',
  // Transparent subtle
  ghost:     'text-[#89978F] hover:text-[#F1F5F2] hover:bg-[#1B2920]',
  // Metallic silver outlined
  outline:   'border border-[#1F2E25] text-[#AEBBB4] hover:bg-[#1B2920] hover:border-[#70E0A0]/40 hover:text-[#A3FFD0]',
}

const SIZES = {
  sm:  'px-3 py-1.5 text-xs rounded-xl gap-1.5 font-medium',
  md:  'px-4 py-2   text-sm rounded-xl gap-2 font-medium',
  lg:  'px-6 py-2.5 text-sm rounded-xl gap-2.5 font-semibold',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none active:scale-[0.98]',
        'disabled:opacity-40 disabled:cursor-not-allowed font-heading tracking-wide',
        VARIANTS[variant], SIZES[size], className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin text-current" /> : icon}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
export default Button
