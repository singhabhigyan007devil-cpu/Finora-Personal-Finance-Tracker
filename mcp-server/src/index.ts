/**
 * FINORA MCP Server
 * Exposes financial telemetry and subscription management tools for AI agents
 * compliant with the Model Context Protocol (MCP).
 *
 * Tools:
 *   - get_monthly_spending: Returns inflow, outflow, and net balance for a specified calendar month.
 *   - get_subscription_list: Inspects tracked recurring commitments with filtering and cost breakdown.
 *   - get_upcoming_payments: Scans near-term renewals within an N-day look-ahead window.
 *   - analyse_spending: Calculates category shares and identifies primary capital expenditure drivers.
 *   - compare_monthly_expenses: Evaluates month-over-month expenditure velocity.
 *   - get_budget_status: Returns category threshold utilization and breach warnings.
 *   - create_payment_reminder: Registers simulated payment reminders with human-in-the-loop audit logs.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js'

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
}

interface Subscription {
  id: string
  name: string
  logo: string
  amount: number
  billingFrequency: string
  nextRenewal: string
  category: string
  status: 'active' | 'cancelled'
}

interface Budget {
  id: string
  category: string
  limit: number
  spent: number
}

// Controlled sandbox dataset
const transactions: Transaction[] = [
  { id: 't1',  date: '2026-11-01', description: 'Salary Deposit',        amount: 85000, type: 'income',  category: 'Others' },
  { id: 't9',  date: '2026-11-09', description: 'Freelance AI Contract', amount: 15000, type: 'income',  category: 'Others' },
  { id: 't2',  date: '2026-11-02', description: 'Swiggy Gourmet Order',  amount: 450,   type: 'expense', category: 'Food' },
  { id: 't3',  date: '2026-11-03', description: 'Uber Premier',          amount: 280,   type: 'expense', category: 'Travel' },
  { id: 't4',  date: '2026-11-04', description: 'Amazon Electronics',    amount: 2200,  type: 'expense', category: 'Shopping' },
  { id: 't5',  date: '2026-11-05', description: 'Netflix 4K Ultra',      amount: 649,   type: 'expense', category: 'Entertainment' },
  { id: 't6',  date: '2026-11-06', description: 'Electricity Bill',      amount: 1800,  type: 'expense', category: 'Bills' },
  { id: 't7',  date: '2026-11-07', description: 'Apollo Pharmacy',       amount: 320,   type: 'expense', category: 'Healthcare' },
  { id: 't8',  date: '2026-11-08', description: 'Zomato Dining',         amount: 380,   type: 'expense', category: 'Food' },
  { id: 't10', date: '2026-11-10', description: 'Cult.Fit Gym Pass',     amount: 1500,  type: 'expense', category: 'Healthcare' },
  { id: 't11', date: '2026-11-11', description: 'Spotify Premium Duo',  amount: 119,   type: 'expense', category: 'Entertainment' },
  { id: 't12', date: '2026-11-12', description: 'HPCL Fuel Petrol',      amount: 2500,  type: 'expense', category: 'Travel' },
  { id: 't13', date: '2026-11-13', description: 'Coursera AI Cert',      amount: 499,   type: 'expense', category: 'Education' },
  { id: 't14', date: '2026-11-14', description: 'Nature Basket Grocery', amount: 1800,  type: 'expense', category: 'Food' },
  { id: 't15', date: '2026-11-15', description: 'Airtel Fiber Postpaid', amount: 599,   type: 'expense', category: 'Bills' },
  { id: 't16', date: '2026-11-16', description: 'Social Kitchen Dinner', amount: 1200,  type: 'expense', category: 'Food' },
  { id: 't17', date: '2026-11-17', description: 'Google One Cloud 2TB',  amount: 130,   type: 'expense', category: 'Others' },
  { id: 't18', date: '2026-11-18', description: 'O\'Reilly Tech Books',  amount: 450,   type: 'expense', category: 'Education' },
  { id: 't19', date: '2026-11-19', description: 'IndiGo Flight Ticket',  amount: 5500,  type: 'expense', category: 'Travel' },
  { id: 't20', date: '2026-11-20', description: 'Zara Winter Collection',amount: 3200,  type: 'expense', category: 'Shopping' },
  { id: 't21', date: '2026-11-21', description: 'ACT Fibernet 300Mbps',  amount: 999,   type: 'expense', category: 'Bills' },
  { id: 't22', date: '2026-11-22', description: 'Blue Tokai Specialty',  amount: 180,   type: 'expense', category: 'Food' },
]

const subscriptions: Subscription[] = [
  { id: 's1', name: 'Netflix 4K',       logo: '🎬', amount: 649,  billingFrequency: 'monthly', nextRenewal: '2026-12-05', category: 'Entertainment', status: 'active' },
  { id: 's2', name: 'Spotify Premium',  logo: '🎵', amount: 119,  billingFrequency: 'monthly', nextRenewal: '2026-11-28', category: 'Entertainment', status: 'active' },
  { id: 's3', name: 'YouTube Premium',  logo: '📺', amount: 189,  billingFrequency: 'monthly', nextRenewal: '2026-12-01', category: 'Entertainment', status: 'active' },
  { id: 's4', name: 'Amazon Prime',     logo: '📦', amount: 299,  billingFrequency: 'monthly', nextRenewal: '2026-12-10', category: 'Shopping',      status: 'active' },
  { id: 's5', name: 'Google One 2TB',   logo: '☁️', amount: 130,  billingFrequency: 'monthly', nextRenewal: '2026-11-30', category: 'Storage',       status: 'active' },
  { id: 's6', name: 'Notion AI Plus',   logo: '📝', amount: 160,  billingFrequency: 'monthly', nextRenewal: '2026-12-15', category: 'Productivity',  status: 'active' },
  { id: 's7', name: 'GitHub Copilot',   logo: '💻', amount: 850,  billingFrequency: 'monthly', nextRenewal: '2026-12-08', category: 'Developer',     status: 'active' },
  { id: 's8', name: 'Adobe Creative CC',logo: '🎨', amount: 1675, billingFrequency: 'monthly', nextRenewal: '2026-12-20', category: 'Creative',      status: 'cancelled' },
]

const budgets: Budget[] = [
  { id: 'b1', category: 'Food',          limit: 5000,  spent: 4010 },
  { id: 'b2', category: 'Travel',        limit: 8000,  spent: 8280 },
  { id: 'b3', category: 'Shopping',      limit: 5000,  spent: 5400 },
  { id: 'b4', category: 'Entertainment', limit: 2000,  spent: 1417 },
  { id: 'b5', category: 'Bills',         limit: 4000,  spent: 3398 },
  { id: 'b6', category: 'Healthcare',    limit: 3000,  spent: 1820 },
]

const reminders: Array<{ service: string; date: string; created: string }> = []

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

const server = new Server(
  { name: 'finora-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_monthly_spending',
      description: 'Returns total income, expenses, and net balance for a specified month and year.',
      inputSchema: {
        type: 'object',
        properties: {
          month: { type: 'number', description: 'Month (1-12)', minimum: 1, maximum: 12 },
          year:  { type: 'number', description: 'Calendar year, e.g. 2026' },
        },
        required: ['month', 'year'],
      },
    },
    {
      name: 'get_subscription_list',
      description: 'Lists tracked subscriptions with cost summaries, billing frequency, and active status.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['all', 'active', 'cancelled'], description: 'Filter by subscription status' },
        },
      },
    },
    {
      name: 'get_upcoming_payments',
      description: 'Returns subscriptions scheduled for renewal within an N-day look-ahead window.',
      inputSchema: {
        type: 'object',
        properties: {
          days: { type: 'number', description: 'Number of look-ahead days (default 30)', minimum: 1, maximum: 365 },
        },
      },
    },
    {
      name: 'analyse_spending',
      description: 'Provides category breakdown of outflows and identifies top spending areas for a given period.',
      inputSchema: {
        type: 'object',
        properties: {
          month: { type: 'number', minimum: 1, maximum: 12 },
          year:  { type: 'number' },
        },
        required: ['month', 'year'],
      },
    },
    {
      name: 'compare_monthly_expenses',
      description: 'Compares total expenditure and percentage variance across two specified months.',
      inputSchema: {
        type: 'object',
        properties: {
          month1: { type: 'number', minimum: 1, maximum: 12 },
          year1:  { type: 'number' },
          month2: { type: 'number', minimum: 1, maximum: 12 },
          year2:  { type: 'number' },
        },
        required: ['month1', 'year1', 'month2', 'year2'],
      },
    },
    {
      name: 'get_budget_status',
      description: 'Returns budget threshold utilization, remaining headroom, and over-budget warnings.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'create_payment_reminder',
      description: 'Registers a simulated payment reminder notification. Never triggers real financial transfers.',
      inputSchema: {
        type: 'object',
        properties: {
          service:       { type: 'string', description: 'Name of subscription service or payment target' },
          reminder_date: { type: 'string', description: 'Target date in YYYY-MM-DD format' },
        },
        required: ['service', 'reminder_date'],
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params

  switch (name) {
    case 'get_monthly_spending': {
      const { month, year } = args as { month: number; year: number }
      const tx = transactions.filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === month - 1 && d.getFullYear() === year
      })
      const income   = tx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expenses = tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            period: `${month}/${year}`,
            inflow: fmt(income),
            outflow: fmt(expenses),
            net_balance: fmt(income - expenses),
            transactions_tallied: tx.length,
          }, null, 2),
        }],
      }
    }

    case 'get_subscription_list': {
      const { status = 'active' } = args as { status?: string }
      const list = status === 'all' ? subscriptions : subscriptions.filter(s => s.status === status)
      const monthlyTotal = list.reduce((s, sub) => s + sub.amount, 0)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status_filter: status,
            count: list.length,
            committed_monthly: fmt(monthlyTotal),
            annualized_runrate: fmt(monthlyTotal * 12),
            subscriptions: list.map(s => ({
              service: s.name,
              amount: fmt(s.amount),
              cadence: s.billingFrequency,
              renewal_date: s.nextRenewal,
              category: s.category,
              status: s.status,
            })),
          }, null, 2),
        }],
      }
    }

    case 'get_upcoming_payments': {
      const { days = 30 } = args as { days?: number }
      const now = Date.now()
      const upcoming = subscriptions
        .filter(s => s.status === 'active')
        .map(s => ({
          ...s,
          days_until: Math.ceil((new Date(s.nextRenewal).getTime() - now) / 86400000),
        }))
        .filter(s => s.days_until >= 0 && s.days_until <= days)
        .sort((a, b) => a.days_until - b.days_until)

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            look_ahead_days: days,
            upcoming_renewals_count: upcoming.length,
            total_earmarked: fmt(upcoming.reduce((s, x) => s + x.amount, 0)),
            renewals: upcoming.map(u => ({
              service: u.name,
              amount: fmt(u.amount),
              renewal_date: u.nextRenewal,
              days_remaining: u.days_until,
            })),
          }, null, 2),
        }],
      }
    }

    case 'analyse_spending': {
      const { month, year } = args as { month: number; year: number }
      const expenses = transactions.filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === month - 1 && d.getFullYear() === year && t.type === 'expense'
      })
      const totals: Record<string, number> = {}
      expenses.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount })
      const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0)
      const breakdown = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amt]) => ({
          category: cat,
          amount: fmt(amt),
          share: `${((amt / (grandTotal || 1)) * 100).toFixed(1)}%`,
        }))

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            period: `${month}/${year}`,
            total_outflow: fmt(grandTotal),
            category_distribution: breakdown,
            primary_driver: breakdown[0]?.category || 'None',
          }, null, 2),
        }],
      }
    }

    case 'compare_monthly_expenses': {
      const { month1, year1, month2, year2 } = args as { month1: number; year1: number; month2: number; year2: number }
      const exp1 = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === month1 - 1 && d.getFullYear() === year1 && t.type === 'expense' }).reduce((s, t) => s + t.amount, 0)
      const exp2 = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === month2 - 1 && d.getFullYear() === year2 && t.type === 'expense' }).reduce((s, t) => s + t.amount, 0)
      const delta = exp1 - exp2
      const pctVariance = exp2 > 0 ? ((delta / exp2) * 100).toFixed(1) : '0'

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            period1: `${month1}/${year1}`,
            total1: fmt(exp1),
            period2: `${month2}/${year2}`,
            total2: fmt(exp2),
            delta: fmt(Math.abs(delta)),
            variance_pct: `${pctVariance}%`,
            direction: delta > 0 ? 'increased' : 'decreased',
          }, null, 2),
        }],
      }
    }

    case 'get_budget_status': {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            budgets: budgets.map(b => {
              const pct = (b.spent / (b.limit || 1) * 100).toFixed(1)
              return {
                category: b.category,
                authorized_ceiling: fmt(b.limit),
                consumed: fmt(b.spent),
                remaining_headroom: fmt(Math.max(0, b.limit - b.spent)),
                utilization: `${pct}%`,
                status: b.spent > b.limit ? 'BREACHED' : parseFloat(pct) >= 80 ? 'CRITICAL' : 'HEALTHY',
              }
            }),
          }, null, 2),
        }],
      }
    }

    case 'create_payment_reminder': {
      const { service, reminder_date } = args as { service: string; reminder_date: string }
      if (!service || !reminder_date) {
        throw new McpError(ErrorCode.InvalidParams, 'service and reminder_date parameters are required')
      }
      const reminder = { service, date: reminder_date, created: new Date().toISOString() }
      reminders.push(reminder)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            action: 'reminder_registered',
            status: 'SUCCESS',
            note: 'Simulated alert recorded. Zero automated banking debits or transfers were initiated.',
            data: reminder,
          }, null, 2),
        }],
      }
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Tool not recognized: ${name}`)
  }
})

async function run() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('FINORA MCP Server listening via stdio transport')
}

run().catch((err) => {
  console.error('MCP Server Fatal:', err)
  process.exit(1)
})
