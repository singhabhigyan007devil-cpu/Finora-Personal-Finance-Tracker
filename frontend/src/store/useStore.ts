import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockTransactions, mockSubscriptions, mockBudgets, Transaction, Subscription, Budget } from '../data/mockData'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AppState {
  isAuthenticated: boolean
  user: { name: string; email: string; avatar: string } | null
  login: (name: string, email: string) => void
  logout: () => void

  transactions: Transaction[]
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, t: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  subscriptions: Subscription[]
  addSubscription: (s: Omit<Subscription, 'id'>) => void
  updateSubscription: (id: string, s: Partial<Subscription>) => void
  deleteSubscription: (id: string) => void

  budgets: Budget[]
  addBudget: (b: Omit<Budget, 'id'>) => void
  updateBudget: (id: string, b: Partial<Budget>) => void
  deleteBudget: (id: string) => void

  messages: Message[]
  addMessage: (m: Omit<Message, 'id' | 'timestamp'>) => void
  clearMessages: () => void

  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const uid = () => Math.random().toString(36).slice(2, 9)

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false, // default unauthenticated so landing page shows first
      user: { name: 'Aryan Patel', email: 'aryan@finora.io', avatar: 'AP' },
      login: (name, email) => set({ 
        isAuthenticated: true, 
        user: { name, email, avatar: name.split(' ').map(n=>n[0]).join('').toUpperCase() || 'U' } 
      }),
      logout: () => set({ isAuthenticated: false, user: null }),

      transactions: mockTransactions,
      addTransaction: (t) => set((s) => ({ transactions: [{ ...t, id: 't' + uid() }, ...s.transactions] })),
      updateTransaction: (id, t) => set((s) => ({ transactions: s.transactions.map(x => x.id === id ? { ...x, ...t } : x) })),
      deleteTransaction: (id) => set((s) => ({ transactions: s.transactions.filter(x => x.id !== id) })),

      subscriptions: mockSubscriptions,
      addSubscription: (s) => set((st) => ({ subscriptions: [{ ...s, id: 's' + uid() }, ...st.subscriptions] })),
      updateSubscription: (id, s) => set((st) => ({ subscriptions: st.subscriptions.map(x => x.id === id ? { ...x, ...s } : x) })),
      deleteSubscription: (id) => set((st) => ({ subscriptions: st.subscriptions.filter(x => x.id !== id) })),

      budgets: mockBudgets,
      addBudget: (b) => set((s) => ({ budgets: [{ ...b, id: 'b' + uid() }, ...s.budgets] })),
      updateBudget: (id, b) => set((s) => ({ budgets: s.budgets.map(x => x.id === id ? { ...x, ...b } : x) })),
      deleteBudget: (id) => set((s) => ({ budgets: s.budgets.filter(x => x.id !== id) })),

      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: '👋 **Welcome to FINORA AI!** I have loaded your live financial context. You can ask me questions like:\n• "Where is most of my money going?"\n• "Which subscriptions are renewing soon?"\n• "How much can I save this month?"\n• "What is my budget status across categories?"',
          timestamp: new Date().toISOString()
        }
      ],
      addMessage: (m) => set((s) => ({ messages: [...s.messages, { ...m, id: uid(), timestamp: new Date().toISOString() }] })),
      clearMessages: () => set({ messages: [] }),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'finora-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        transactions: state.transactions,
        subscriptions: state.subscriptions,
        budgets: state.budgets,
      }),
    }
  )
)
