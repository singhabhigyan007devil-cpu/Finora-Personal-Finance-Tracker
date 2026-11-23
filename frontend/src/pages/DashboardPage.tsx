import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'
import { currentMonthTransactions, formatCurrency, daysUntil, formatDate } from '../utils/format'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import SpendingBar from '../components/charts/SpendingBar'
import CategoryDonut from '../components/charts/CategoryDonut'
import SubscriptionBreakdown from '../components/charts/SubscriptionBreakdown'
import ProgressBar from '../components/ui/ProgressBar'

export default function DashboardPage() {
  const { transactions, subscriptions, budgets } = useStore()

  const stats = useMemo(() => {
    const current = currentMonthTransactions(transactions)
    const income   = current.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expenses = current.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const activeSubs = subscriptions.filter(s => s.status === 'active')
    const subCost = activeSubs.reduce((s, sub) => s + sub.amount, 0)
    const savings = Math.max(0, income - expenses)
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(0) : '0'

    return {
      netWorth: 2450000, // ₹24.5 Lakhs
      income,
      expenses,
      balance: income - expenses,
      savings,
      savingsRate,
      subCost,
    }
  }, [transactions, subscriptions])

  const upcoming = useMemo(() =>
    subscriptions
      .filter(s => s.status === 'active')
      .map(s => ({ ...s, days: daysUntil(s.nextRenewal) }))
      .filter(s => s.days <= 14 && s.days >= 0)
      .sort((a, b) => a.days - b.days),
  [subscriptions])

  const recentTx = useMemo(() =>
    [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6),
  [transactions])

  const totalBudgetLimit = budgets.reduce((s, b) => s + b.limit, 0)
  const totalBudgetSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const budgetUtilization = Math.round((totalBudgetSpent / (totalBudgetLimit || 1)) * 100)

  return (
    <div className="space-y-6">
      {/* Friendly, Clear Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2E25]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0] animate-pulse" />
            <span className="text-[10px] font-mono text-[#A3FFD0] tracking-widest uppercase">LIVE FINANCIAL DASHBOARD</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] font-heading tracking-tight">Financial Overview</h1>
          <p className="text-xs text-[#89978F] mt-0.5">Your complete financial summary for November 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="hologram">LIVE SYNC ACTIVE</Badge>
          <div className="text-right hidden sm:block border-l border-[#1F2E25] pl-3">
            <span className="text-[10px] text-[#89978F] block uppercase font-mono tracking-wider">Total Net Worth</span>
            <span className="text-sm font-bold text-[#70E0A0] font-heading tabular-nums shadow-sm">{formatCurrency(stats.netWorth)}</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics: Clear, Intuitive Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Monthly Income"
          value={formatCurrency(stats.income)}
          subValue="Salary, contracts & yields"
          icon={TrendingUp}
          tone="positive"
          trend={{ value: 17.6, positive: true }}
          index={0}
        />
        <StatCard
          label="Total Monthly Expenses"
          value={formatCurrency(stats.expenses)}
          subValue="Bills, dining & shopping"
          icon={TrendingDown}
          tone="negative"
          trend={{ value: 5.2, positive: false }}
          index={1}
        />
        <StatCard
          label="Available Balance"
          value={formatCurrency(stats.balance)}
          subValue="Ready to spend or save"
          icon={ArrowUpRight}
          tone="default"
          index={2}
        />
        <StatCard
          label="Saved This Month"
          value={formatCurrency(stats.savings)}
          subValue={`${stats.savingsRate}% of income saved`}
          icon={Sparkles}
          tone="positive"
          index={3}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <SpendingBar />
        <CategoryDonut transactions={transactions} />
      </div>

      {/* Secondary Row: Subscriptions, Budget Progress & Upcoming Renewals */}
      <div className="grid lg:grid-cols-3 gap-6">
        <SubscriptionBreakdown subscriptions={subscriptions} />

        {/* Monthly Budget Allocation */}
        <Card spatial>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]" />
                <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Monthly Budget Status</h3>
              </div>
              <p className="text-xs text-[#89978F] mt-0.5">Category spending limits & remaining room</p>
            </div>
            <Badge variant={budgetUtilization > 100 ? 'danger' : budgetUtilization >= 80 ? 'warning' : 'success'}>
              {budgetUtilization}%
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 tabular-nums font-mono">
                <span className="text-[#89978F]">Spent: {formatCurrency(totalBudgetSpent)}</span>
                <span className="text-[#A3FFD0] font-semibold">Budget: {formatCurrency(totalBudgetLimit)}</span>
              </div>
              <ProgressBar value={budgetUtilization} size="md" />
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[#1F2E25]">
              {budgets.slice(0, 3).map(b => (
                <div key={b.id} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#89978F] truncate max-w-[140px]">{b.category}</span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="text-[#F1F5F2] font-semibold">{formatCurrency(b.spent)}</span>
                    <span className="text-[#89978F]">/ {formatCurrency(b.limit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Upcoming Renewals */}
        <Card spatial>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#70E0A0]" />
              <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Upcoming Bills & Renewals</h3>
            </div>
            <span className="text-[10px] text-[#A3FFD0] font-mono px-2 py-0.5 rounded bg-[#1B2920] border border-[#2A3F33]">NEXT 14 DAYS</span>
          </div>

          {upcoming.length === 0 ? (
            <p className="text-xs text-[#89978F] py-8 text-center">No subscriptions renewing in the next 14 days.</p>
          ) : (
            <div className="space-y-2.5">
              {upcoming.map(sub => (
                <div key={sub.id} className="flex items-center justify-between py-2 border-b border-[#1F2E25] last:border-0 hover:bg-[#1B2920]/40 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{sub.logo}</span>
                    <div>
                      <p className="text-xs font-semibold text-[#F1F5F2] font-heading truncate max-w-[130px]">{sub.name}</p>
                      <p className="text-[10px] text-[#89978F] font-mono">{formatDate(sub.nextRenewal)}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F1F5F2] font-heading tabular-nums">{formatCurrency(sub.amount)}</span>
                    <Badge variant={sub.days <= 3 ? 'danger' : sub.days <= 7 ? 'warning' : 'neutral'} size="sm">
                      {sub.days === 0 ? 'Due Today' : `${sub.days}d`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card spatial>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1F2E25]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0]" />
              <h3 className="text-sm font-bold text-[#F1F5F2] font-heading tracking-wide">Recent Transactions</h3>
            </div>
            <p className="text-xs text-[#89978F] mt-0.5">Your latest payments and deposits</p>
          </div>
          <span className="text-[10px] text-[#A3FFD0] font-mono tabular-nums px-2.5 py-0.5 rounded bg-[#1B2920] border border-[#2A3F33]">{transactions.length} RECORDED</span>
        </div>

        <div className="divide-y divide-[#1F2E25]">
          {recentTx.map((tx, i) => (
            <motion.div
              key={tx.id}
              className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-[#1B2920]/60 transition-colors cursor-pointer group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="w-8 h-8 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center flex-shrink-0 group-hover:border-[#70E0A0] transition-colors">
                {tx.type === 'income' ? (
                  <ArrowDownRight size={14} className="text-[#70E0A0]" />
                ) : (
                  <ArrowUpRight size={14} className="text-[#D98989]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#F1F5F2] truncate font-heading group-hover:text-white transition-colors">{tx.description}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#89978F] font-mono">
                  <span>{formatDate(tx.date)}</span>
                  <span>•</span>
                  <span>{tx.category}</span>
                </div>
              </div>
              <span className={`text-xs font-bold font-heading tabular-nums ${
                tx.type === 'income' ? 'text-[#70E0A0]' : 'text-[#F1F5F2]'
              }`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
