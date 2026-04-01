import { mockTransactions } from '../data/mockTransactions'
import type { Transaction } from '../types/finance'

const NETWORK_DELAY_MS = 700
const ERROR_FLAG_KEY = 'finance-dashboard:force-api-error'

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function fetchTransactionsApi(): Promise<Transaction[]> {
  await wait(NETWORK_DELAY_MS)

  const shouldFail = localStorage.getItem(ERROR_FLAG_KEY) === '1'
  if (shouldFail) {
    throw new Error('Unable to fetch transactions from mock API.')
  }

  return structuredClone(mockTransactions)
}
