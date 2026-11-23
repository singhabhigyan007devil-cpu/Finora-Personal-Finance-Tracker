import { forwardRef, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  elevated?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
  spatial?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, elevated = false, padding = 'md', spatial = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-2xl transition-all duration-200 border relative overflow-hidden',
          elevated
            ? 'bg-[#1B2920] border-[#2A3F33]'
            : 'bg-[#131D17] border-[#1F2E25]',
          hover && 'hover:bg-[#16241C] hover:border-[#2A3F33] hover:-translate-y-0.5 cursor-pointer hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6),0_0_16px_rgba(112,224,160,0.08)]',
          spatial && 'spatial-panel backdrop-blur-sm',
          padding === 'sm'   && 'p-3.5',
          padding === 'md'   && 'p-5',
          padding === 'lg'   && 'p-7',
          padding === 'none' && '',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'
export default Card
