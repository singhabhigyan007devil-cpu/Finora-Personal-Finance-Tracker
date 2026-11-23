export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Subscription {
  id: string;
  name: string;
  logo: string;
  amount: number;
  billingFrequency: 'monthly' | 'annual' | 'weekly';
  nextRenewal: string;
  category: string;
  status: 'active' | 'cancelled';
  color: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
}

export const CATEGORIES = [
  'Housing & Utilities', 'Food & Dining', 'Transit & Travel', 'Software & Cloud',
  'Health & Wellness', 'Education', 'Shopping', 'Others'
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Housing & Utilities': '#70E0A0',
  'Food & Dining': '#A3FFD0',
  'Transit & Travel': '#89B8A0',
  'Software & Cloud': '#AEBBB4',
  'Health & Wellness': '#52B788',
  'Education': '#C8E6C9',
  'Shopping': '#D98989',
  'Others': '#89978F',
  // Backwards compatibility for legacy category names
  'Food': '#A3FFD0',
  'Travel': '#89B8A0',
  'Bills': '#70E0A0',
  'Entertainment': '#AEBBB4',
  'Healthcare': '#52B788',
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', date: '2026-11-20', description: 'Client Consulting & Software Engineering', amount: 320000, type: 'income', category: 'Software & Cloud' },
  { id: 'tx-2', date: '2026-11-19', description: 'Office Rent & Facilities', amount: 85000, type: 'expense', category: 'Housing & Utilities' },
  { id: 'tx-3', date: '2026-11-18', description: 'AWS Cloud Server Hosting', amount: 24500, type: 'expense', category: 'Software & Cloud' },
  { id: 'tx-4', date: '2026-11-18', description: 'Advisory Retainer Fee', amount: 150000, type: 'income', category: 'Others' },
  { id: 'tx-5', date: '2026-11-17', description: 'Metro & Fast Transit Pass', amount: 6200, type: 'expense', category: 'Transit & Travel' },
  { id: 'tx-6', date: '2026-11-16', description: 'Organic Groceries & Provisions', amount: 12400, type: 'expense', category: 'Food & Dining' },
  { id: 'tx-7', date: '2026-11-15', description: 'OpenAI API Team Access', amount: 18200, type: 'expense', category: 'Software & Cloud' },
  { id: 'tx-8', date: '2026-11-14', description: 'Fitness & Gym Membership', amount: 8000, type: 'expense', category: 'Health & Wellness' },
  { id: 'tx-9', date: '2026-11-13', description: 'GitHub Copilot Enterprise', amount: 3200, type: 'expense', category: 'Software & Cloud' },
  { id: 'tx-10', date: '2026-11-12', description: 'Vercel Web Hosting', amount: 12500, type: 'expense', category: 'Software & Cloud' },
  { id: 'tx-11', date: '2026-11-10', description: 'Mutual Fund Dividend Payout', amount: 95000, type: 'income', category: 'Others' },
  { id: 'tx-12', date: '2026-11-09', description: 'Airport Cab & Ride Services', amount: 18500, type: 'expense', category: 'Transit & Travel' },
  { id: 'tx-13', date: '2026-11-08', description: 'Fine Dining with Team', amount: 9800, type: 'expense', category: 'Food & Dining' },
  { id: 'tx-14', date: '2026-11-06', description: 'Annual Health Checkup & Labs', amount: 15000, type: 'expense', category: 'Health & Wellness' },
  { id: 'tx-15', date: '2026-11-05', description: 'Figma Design Team Seats', amount: 6400, type: 'expense', category: 'Software & Cloud' },
  { id: 'tx-16', date: '2026-11-04', description: 'Anthropic Claude AI Pro Plan', amount: 14000, type: 'expense', category: 'Software & Cloud' },
  { id: 'tx-17', date: '2026-11-03', description: 'Bloomberg Financial Data Terminal', amount: 45000, type: 'expense', category: 'Software & Cloud' },
  { id: 'tx-18', date: '2026-11-02', description: 'Formal Apparel & Tailoring', amount: 22000, type: 'expense', category: 'Shopping' },
  { id: 'tx-19', date: '2026-11-01', description: 'Full Stack Engineering Course', amount: 18000, type: 'expense', category: 'Education' },
  { id: 'tx-20', date: '2026-11-01', description: 'Startup Angel Investment Return', amount: 280000, type: 'income', category: 'Others' },
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub-1', name: 'Bloomberg Financial Terminal', logo: '⚡', amount: 45000, billingFrequency: 'monthly', nextRenewal: '2026-11-28', category: 'Software & Cloud', status: 'active', color: '#70E0A0' },
  { id: 'sub-2', name: 'AWS Cloud Hosting', logo: '☁️', amount: 24500, billingFrequency: 'monthly', nextRenewal: '2026-11-29', category: 'Software & Cloud', status: 'active', color: '#A3FFD0' },
  { id: 'sub-3', name: 'OpenAI API Team Suite', logo: '🧠', amount: 18200, billingFrequency: 'monthly', nextRenewal: '2026-12-02', category: 'Software & Cloud', status: 'active', color: '#AEBBB4' },
  { id: 'sub-4', name: 'Anthropic Claude Pro', logo: '🤖', amount: 14000, billingFrequency: 'monthly', nextRenewal: '2026-12-05', category: 'Software & Cloud', status: 'active', color: '#70E0A0' },
  { id: 'sub-5', name: 'Vercel Edge Platform', logo: '🌐', amount: 12500, billingFrequency: 'monthly', nextRenewal: '2026-12-10', category: 'Software & Cloud', status: 'active', color: '#52B788' },
  { id: 'sub-6', name: 'Executive Longevity Bio-Pass', logo: '🫀', amount: 8000, billingFrequency: 'monthly', nextRenewal: '2026-12-12', category: 'Health & Wellness', status: 'active', color: '#70E0A0' },
  { id: 'sub-7', name: 'Figma Enterprise Matrix', logo: '🎨', amount: 6400, billingFrequency: 'monthly', nextRenewal: '2026-12-14', category: 'Software & Cloud', status: 'active', color: '#A3FFD0' },
  { id: 'sub-8', name: 'Legacy Satellite Streaming Pass', logo: '📺', amount: 1899, billingFrequency: 'monthly', nextRenewal: '2026-12-18', category: 'Others', status: 'cancelled', color: '#D98989' },
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: 'b-1', category: 'Housing & Utilities', limit: 120000, spent: 85000, color: '#70E0A0' },
  { id: 'b-2', category: 'Software & Cloud', limit: 160000, spent: 121800, color: '#A3FFD0' },
  { id: 'b-3', category: 'Transit & Travel', limit: 40000, spent: 24700, color: '#89B8A0' },
  { id: 'b-4', category: 'Food & Dining', limit: 35000, spent: 22200, color: '#52B788' },
  { id: 'b-5', category: 'Health & Wellness', limit: 30000, spent: 23000, color: '#70E0A0' },
  { id: 'b-6', category: 'Shopping', limit: 35000, spent: 22000, color: '#D98989' },
];

export const mockTransactions = INITIAL_TRANSACTIONS;
export const mockSubscriptions = INITIAL_SUBSCRIPTIONS;
export const mockBudgets = INITIAL_BUDGETS;

export const monthlySpendingData = [
  { month: 'Jun', income: 680000, expenses: 240000 },
  { month: 'Jul', income: 720000, expenses: 265000 },
  { month: 'Aug', income: 790000, expenses: 280000 },
  { month: 'Sep', income: 750000, expenses: 255000 },
  { month: 'Oct', income: 810000, expenses: 290000 },
  { month: 'Nov', income: 845000, expenses: 298700 },
];
