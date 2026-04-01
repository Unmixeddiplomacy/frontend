import { format, parseISO } from 'date-fns'

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount)
}

export function formatPercent(value: number) {
  return percentFormatter.format(value)
}

export function formatDate(date: string) {
  return format(parseISO(date), 'dd MMM yyyy')
}

export function formatMonth(date: string) {
  return format(parseISO(date), 'MMM yyyy')
}
