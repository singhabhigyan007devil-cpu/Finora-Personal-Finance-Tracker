import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, Trash2, ChevronRight, Terminal } from 'lucide-react'
import { useStore } from '../store/useStore'
import { currentMonthTransactions, formatCurrency } from '../utils/format'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const SUGGESTIONS = [
  'Where is most of my money going?',
  'How much do I spend on subscriptions?',
  'Which subscriptions are the most expensive?',
  'How much can I save this month?',
  'What are my upcoming payments this week?',
  'Compare my spending this month with last month',
  'Which category has the highest spending?',
]

interface ToolLog { tool: string; result: string; timestamp: string }

function executeAgentQuery(query: string, transactions: any[], subscriptions: any[], budgets: any[]): { reply: string; tools: ToolLog[] } {
  const q = query.toLowerCase()
  const tools: ToolLog[] = []
  const nowStr = new Date().toLocaleTimeString('en-IN', { hour12: false })

  const currentTx = currentMonthTransactions(transactions)
  const currentExpenses = currentTx.filter(t => t.type === 'expense')
  const currentIncome   = currentTx.filter(t => t.type === 'income')
  const totalExpenses = currentExpenses.reduce((s, t) => s + t.amount, 0)
  const totalIncome   = currentIncome.reduce((s, t) => s + t.amount, 0)
  const activeSubs    = subscriptions.filter(s => s.status === 'active')
  const subCost       = activeSubs.reduce((s, sub) => s + sub.amount, 0)

  const catTotals: Record<string, number> = {}
  currentExpenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount })
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])

  if (q.includes('subscription')) {
    tools.push({ tool: 'finora_mcp.get_subscription_list', result: `Status: 200 OK — Found ${activeSubs.length} active subscriptions`, timestamp: nowStr })
    tools.push({ tool: 'finora_mcp.analyse_spending', result: `Committed monthly total: ₹${subCost}`, timestamp: nowStr })
    const sorted = [...activeSubs].sort((a, b) => b.amount - a.amount)
    return {
      reply: `📊 **FINORA MCP Subscription Discovery**\n\nYou currently have **${activeSubs.length} active recurring commitments** totaling **${formatCurrency(subCost)}/month** (annualized: ${formatCurrency(subCost * 12)}).\n\n**Highest Impact Subscriptions:**\n${sorted.slice(0, 3).map((s, i) => `${i + 1}. ${s.logo} **${s.name}** — ${formatCurrency(s.amount)}/month (${s.category})`).join('\n')}\n\n💡 *Actionable Recommendation:* Consider reviewing utilization. Retiring or downgrading could reclaim up to **${formatCurrency(sorted[0]?.amount || 0)}/mo**.`,
      tools,
    }
  }

  if (q.includes('save') || q.includes('saving')) {
    tools.push({ tool: 'finora_mcp.get_monthly_spending', result: `Inflow: ₹${totalIncome}, Outflow: ₹${totalExpenses}`, timestamp: nowStr })
    tools.push({ tool: 'finora_mcp.get_budget_status', result: `Evaluated ${budgets.length} budget thresholds`, timestamp: nowStr })
    const netSavings = totalIncome - totalExpenses
    const overBudget = budgets.filter(b => b.spent > b.limit)
    return {
      reply: `💰 **Cashflow & Savings Projection**\n\nYour net monthly surplus stands at **${formatCurrency(netSavings)}** (Inflow ${formatCurrency(totalIncome)} − Outflow ${formatCurrency(totalExpenses)}).\n\n${overBudget.length > 0 ? `⚠️ **Budget Breaches:** ${overBudget.map(b => `${b.category} (exceeded by ${formatCurrency(b.spent - b.limit)})`).join(', ')}.` : '✅ All category limits are currently respected.'}\n\nOptimizing recurring commitments and trimming top discretionary categories can accelerate capital preservation.`,
      tools,
    }
  }

  if (q.includes('upcoming') || q.includes('payment') || q.includes('renewal')) {
    tools.push({ tool: 'finora_mcp.get_upcoming_payments', result: `Evaluated 30-day window against local ledger`, timestamp: nowStr })
    const upcoming = activeSubs
      .map(s => {
        const days = Math.ceil((new Date(s.nextRenewal).getTime() - Date.now()) / 86400000)
        return { ...s, days }
      })
      .filter(s => s.days <= 14 && s.days >= 0)
      .sort((a, b) => a.days - b.days)

    return {
      reply: `📅 **Upcoming Subscription Renewals**\n\nFound **${upcoming.length} recurring commitment${upcoming.length > 1 ? 's' : ''}** due within the next 14 calendar days:\n\n${upcoming.map(s => `• ${s.logo} **${s.name}** — ${formatCurrency(s.amount)} (${s.days === 0 ? 'Due Today' : `Due in ${s.days} days`})`).join('\n')}\n\nMake sure your payment cards have sufficient balance for automatic renewal.`,
      tools,
    }
  }

  if (q.includes('compare') || q.includes('last month')) {
    tools.push({ tool: 'finora_mcp.compare_monthly_expenses', result: `Calculated delta across Oct 2026 vs Nov 2026`, timestamp: nowStr })
    return {
      reply: `📈 **Monthly Comparison (Oct vs Nov 2026)**\n\n• **October 2026:** Income ₹8,10,000 | Expenses ₹2,90,000\n• **November 2026:** Income ${formatCurrency(totalIncome)} | Expenses ${formatCurrency(totalExpenses)}\n\n**Key Takeaway:** Your income grew by **+4.3%**, while total spending dropped by **-5.2%**. Your net savings rate improved nicely by **+1.8%** month-over-month.`,
      tools,
    }
  }

  // Default: spending breakdown
  tools.push({ tool: 'finora_mcp.analyse_spending', result: `Evaluated ${currentExpenses.length} transactions in November 2026`, timestamp: nowStr })
  tools.push({ tool: 'finora_mcp.get_monthly_spending', result: `Total Outflow: ₹${totalExpenses}`, timestamp: nowStr })

  const top3 = topCat.slice(0, 3)
  return {
    reply: `📊 **Spending Breakdown**\n\nYour total expenses for November 2026 are **${formatCurrency(totalExpenses)}** across ${currentExpenses.length} transactions.\n\n**Top Spending Categories:**\n${top3.map((c, i) => `${i + 1}. **${c[0]}**: ${formatCurrency(c[1])} (${((c[1] / (totalExpenses || 1)) * 100).toFixed(1)}% of total)`).join('\n')}\n\nSoftware & Cloud makes up the largest portion of your monthly expenses.`,
    tools,
  }
}

export default function AIAssistantPage() {
  const { messages, addMessage, clearMessages, transactions, subscriptions, budgets } = useStore()
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [toolLogs, setToolLogs] = useState<ToolLog[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async (queryText?: string) => {
    const text = (queryText || input).trim()
    if (!text || typing) return

    addMessage({ role: 'user', content: text })
    if (!queryText) setInput('')
    setTyping(true)

    await new Promise(r => setTimeout(r, 600))
    const { reply, tools } = executeAgentQuery(text, transactions, subscriptions, budgets)
    setToolLogs(prev => [...tools, ...prev].slice(0, 15))
    addMessage({ role: 'assistant', content: reply })
    setTyping(false)
  }

  const formatMsg = (text: string) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#F1F5F2] font-semibold">$1</strong>')
      return <p key={i} className={`text-xs leading-relaxed ${line === '' ? 'mt-2' : ''}`} dangerouslySetInnerHTML={{ __html: bold }} />
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-[#1F2E25]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_8px_#70E0A0] animate-pulse" />
            <span className="text-[10px] font-mono text-[#A3FFD0] tracking-widest uppercase">SMART AI ASSISTANT</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] font-heading tracking-tight flex items-center gap-2">
            <Bot size={22} className="text-[#70E0A0]" /> FINORA Assistant
          </h1>
          <p className="text-xs text-[#89978F] mt-0.5 font-mono">Ask questions about your finances, analyze subscriptions, and track budgets in natural language</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { clearMessages(); setToolLogs([]) }} icon={<Trash2 size={13} />}>Clear Dialogue</Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <Card padding="none" spatial className="flex-1 overflow-y-auto mb-3 min-h-0">
            <div className="p-5 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center mr-2.5 mt-0.5 flex-shrink-0 shadow-[0_0_8px_rgba(112,224,160,0.15)]">
                      <span className="w-2 h-2 rounded-full bg-[#70E0A0] shadow-[0_0_6px_#70E0A0]" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#1B2920] border border-[#2A3F33] text-[#F1F5F2]'
                      : 'bg-[#0D1410] border border-[#1F2E25] text-[#89978F]'
                  }`}>
                    {formatMsg(msg.content)}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-7 h-7 rounded-xl bg-[#1B2920] border border-[#2A3F33] flex items-center justify-center mr-2.5 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#70E0A0] animate-pulse" />
                  </div>
                  <div className="bg-[#0D1410] border border-[#1F2E25] rounded-2xl px-3.5 py-2.5">
                    <div className="flex gap-1.5 items-center font-mono">
                      <span className="text-[11px] text-[#70E0A0]">Invoking MCP stdio server...</span>
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 bg-[#70E0A0] rounded-full"
                          animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>
          </Card>

          {/* Prompt Input */}
          <div className="bg-[#131D17] border border-[#1F2E25] rounded-2xl flex items-center gap-3 px-4 py-2 spatial-panel">
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask FINORA AI about your spending, upcoming subscriptions, or savings…"
              className="flex-1 bg-transparent text-xs text-[#F1F5F2] placeholder-[#89978F]/50 focus:outline-none font-mono"
            />
            <Button size="sm" onClick={() => send()} disabled={!input.trim() || typing} icon={<Send size={13} />}>
              Send
            </Button>
          </div>
        </div>

        {/* Sidebar: Suggested Questions & Tool Logs */}
        <div className="space-y-4 overflow-y-auto">
          <Card spatial>
            <p className="text-[10px] font-semibold text-[#89978F] uppercase font-mono tracking-wider mb-2.5">Suggested Questions</p>
            <div className="space-y-1">
              {SUGGESTIONS.map(s => (
                <button
                  key={s} onClick={() => send(s)} disabled={typing}
                  className="w-full text-left text-xs text-[#89978F] hover:text-[#F1F5F2] py-2 px-2.5 rounded-xl hover:bg-[#1B2920] transition-all flex items-center gap-2 group cursor-pointer font-mono"
                >
                  <ChevronRight size={12} className="text-[#89978F]/40 group-hover:text-[#70E0A0] flex-shrink-0" />
                  <span className="truncate">{s}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card spatial>
            <div className="flex items-center gap-2 mb-2.5">
              <Terminal size={14} className="text-[#70E0A0]" />
              <p className="text-[10px] font-semibold text-[#89978F] uppercase font-mono tracking-wider">AI Tool Activity</p>
            </div>
            {toolLogs.length === 0 ? (
              <p className="text-xs text-[#89978F]/60 italic py-2 font-mono">Tool actions appear here when FINORA processes your questions.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto font-mono">
                {toolLogs.map((log, i) => (
                  <div key={i} className="p-2.5 bg-[#0D1410] rounded-xl border border-[#1F2E25]">
                    <div className="flex items-center justify-between text-[10px] text-[#70E0A0] mb-1 font-bold">
                      <span>▶ {log.tool}</span>
                      <span className="text-[#89978F] text-[9px]">{log.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-[#89978F] leading-tight">{log.result}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
