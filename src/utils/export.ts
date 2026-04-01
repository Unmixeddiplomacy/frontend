import { formatDate } from './format'
import type { Transaction } from '../types/finance'

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export function exportTransactionsToCsv(transactions: Transaction[]) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  const rows = transactions.map((transaction) => [
    formatDate(transaction.date),
    transaction.description,
    transaction.category,
    transaction.type,
    transaction.amount.toString(),
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n')

  downloadFile(csvContent, 'transactions.csv', 'text/csv;charset=utf-8;')
}

export function exportTransactionsToJson(transactions: Transaction[]) {
  const payload = JSON.stringify(transactions, null, 2)
  downloadFile(payload, 'transactions.json', 'application/json')
}
