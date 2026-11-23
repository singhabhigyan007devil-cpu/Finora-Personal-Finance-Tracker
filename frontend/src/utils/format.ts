export const formatCurrency = (amount: number, currency = '₹') =>
  `${currency}${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export const daysUntil = (dateStr: string): number => {
  try {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  } catch {
    return 0
  }
}

export const currentMonthTransactions = (transactions: { date: string; [k: string]: any }[]) => {
  const now = new Date()
  return transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
}
