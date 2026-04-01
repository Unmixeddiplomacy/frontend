import { createSelector } from '@reduxjs/toolkit'
import { format, parseISO } from 'date-fns'
import type { RootState } from '../../app/store'
import type {
  CategoryBreakdownItem,
  InsightsSummary,
  MonthlyPoint,
  TrendDirection,
  Transaction,
} from '../../types/finance'

const selectTransactions = (state: RootState) => state.transactions.items
const selectFilters = (state: RootState) => state.filters

export const selectUniqueCategories = createSelector([selectTransactions], (items) => {
  return [...new Set(items.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b),
  )
})

export const selectFilteredTransactions = createSelector(
  [selectTransactions, selectFilters],
  (items, filters) => {
    const normalizedSearch = filters.search.toLowerCase().trim()

    const filtered = items.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch)

      const matchesType = filters.type === 'all' || item.type === filters.type
      const matchesCategory =
        filters.category === 'all' || item.category === filters.category

      return matchesSearch && matchesType && matchesCategory
    })

    const sorted = [...filtered].sort((a, b) => {
      const sortMultiplier = filters.sortDirection === 'asc' ? 1 : -1

      if (filters.sortBy === 'amount') {
        return (a.amount - b.amount) * sortMultiplier
      }

      if (filters.sortBy === 'category') {
        return a.category.localeCompare(b.category) * sortMultiplier
      }

      return (
        (new Date(a.date).getTime() - new Date(b.date).getTime()) *
        sortMultiplier
      )
    })

    return sorted
  },
)

export const selectSummary = createSelector([selectTransactions], (items) => {
  const income = items
    .filter((item) => item.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0)

  const expenses = items
    .filter((item) => item.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0)

  return {
    income,
    expenses,
    balance: income - expenses,
  }
})

export const selectMonthlyTrend = createSelector(
  [selectTransactions],
  (items): MonthlyPoint[] => {
    const grouped = new Map<string, { income: number; expense: number }>()

    items.forEach((item) => {
      const key = format(parseISO(item.date), 'yyyy-MM')
      const current = grouped.get(key) ?? { income: 0, expense: 0 }
      if (item.type === 'income') {
        current.income += item.amount
      } else {
        current.expense += item.amount
      }
      grouped.set(key, current)
    })

    return [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, value]) => ({
        month,
        income: value.income,
        expense: value.expense,
        balance: value.income - value.expense,
      }))
  },
)

export const selectCategoryBreakdown = createSelector(
  [selectTransactions],
  (items): CategoryBreakdownItem[] => {
    const expenses = items.filter((item) => item.type === 'expense')
    const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0)

    const grouped = expenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.amount
      return acc
    }, {})

    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses ? amount / totalExpenses : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  },
)

export const selectInsights = createSelector(
  [selectCategoryBreakdown, selectMonthlyTrend, selectSummary, selectTransactions],
  (
    categoryBreakdown,
    monthlyTrend,
    summary,
    transactions,
  ): InsightsSummary => {
    const getDirection = (delta: number): TrendDirection => {
      if (delta > 0) {
        return 'up'
      }
      if (delta < 0) {
        return 'down'
      }
      return 'flat'
    }

    const topCategory = categoryBreakdown[0]
    const currentMonth = monthlyTrend[monthlyTrend.length - 1]
    const previousMonth = monthlyTrend[monthlyTrend.length - 2]

    const previousExpense = previousMonth?.expense ?? 0
    const currentExpense = currentMonth?.expense ?? 0
    const spendingDeltaAmount = currentExpense - previousExpense
    const spendingDirection = previousMonth
      ? getDirection(spendingDeltaAmount)
      : 'na'
    const spendingDeltaPercent = previousExpense
      ? spendingDeltaAmount / previousExpense
      : 0

    const currentSavings = currentMonth?.balance ?? 0
    const previousSavings = previousMonth?.balance ?? 0
    const savingsDeltaAmount = currentSavings - previousSavings
    const savingsDirection = previousMonth ? getDirection(savingsDeltaAmount) : 'na'

    const netSavingsRate = summary.income ? (summary.balance / summary.income) * 100 : 0

    let recommendedFocus =
      'Spending distribution looks balanced. Continue tracking variable expenses weekly.'

    if (summary.balance < 0) {
      recommendedFocus =
        'Expenses are outpacing income. Prioritize reducing discretionary categories this month.'
    } else if ((topCategory?.percentage ?? 0) >= 0.4) {
      recommendedFocus = `${topCategory?.category ?? 'Top category'} is dominating spend. Consider setting a tighter category cap.`
    } else if (netSavingsRate >= 30) {
      recommendedFocus =
        'Savings momentum is strong. You can move surplus into investments or emergency reserves.'
    }

    return {
      highestSpendingCategory: topCategory?.category ?? 'N/A',
      highestSpendingAmount: topCategory?.amount ?? 0,
      topCategoryShare: topCategory?.percentage ?? 0,
      monthlyChangePercent: spendingDeltaPercent,
      monthlyChangeLabel:
        spendingDirection === 'na' ? 'n/a' : spendingDirection,
      netSavingsRate,
      totalTransactions: transactions.length,
      currentMonthLabel: currentMonth?.month ?? 'N/A',
      previousMonthLabel: previousMonth?.month ?? 'N/A',
      spendingDirection,
      spendingDeltaAmount,
      spendingDeltaPercent,
      savingsDirection,
      savingsDeltaAmount,
      recommendedFocus,
    }
  },
)

export const selectLastFiveTransactions = createSelector(
  [selectFilteredTransactions],
  (items): Transaction[] => items.slice(0, 5),
)
