export const ROLES = ['viewer', 'admin'] as const
export const TRANSACTION_TYPES = ['income', 'expense'] as const

export type UserRole = (typeof ROLES)[number]
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export type SortField = 'date' | 'amount' | 'category'
export type SortDirection = 'asc' | 'desc'
export type ThemeMode = 'light' | 'dark'

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: TransactionType
}

export interface FinanceFilters {
  search: string
  type: 'all' | TransactionType
  category: 'all' | string
  sortBy: SortField
  sortDirection: SortDirection
}

export interface MonthlyPoint {
  month: string
  income: number
  expense: number
  balance: number
}

export interface CategoryBreakdownItem {
  category: string
  amount: number
  percentage: number
}

export interface InsightsSummary {
  highestSpendingCategory: string
  highestSpendingAmount: number
  monthlyChangePercent: number
  monthlyChangeLabel: string
  netSavingsRate: number
  totalTransactions: number
}
