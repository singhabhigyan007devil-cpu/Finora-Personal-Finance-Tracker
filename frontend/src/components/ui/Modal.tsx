import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-[#070B09]/85 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${SIZES[size]} bg-[#131D17] rounded-2xl border border-[#2A3F33] shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_24px_rgba(112,224,160,0.1)] overflow-hidden spatial-panel`}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#1F2E25]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_6px_#70E0A0]" />
                <h2 className="text-base font-bold text-[#F1F5F2] font-heading tracking-wide">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#89978F] hover:text-[#F1F5F2] hover:bg-[#1B2920] transition-colors cursor-pointer border border-transparent hover:border-[#1F2E25]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
