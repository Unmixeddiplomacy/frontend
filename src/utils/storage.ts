import type { FinanceFilters, ThemeMode, Transaction, UserRole } from '../types/finance'

const STORAGE_KEY = 'zorvyn-finance-dashboard:v1'

export interface PersistedState {
  transactions: Transaction[]
  filters: FinanceFilters
  role: UserRole
  theme: ThemeMode
}

export function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as PersistedState
    if (!parsed || !Array.isArray(parsed.transactions)) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function savePersistedState(payload: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage write errors.
  }
}
