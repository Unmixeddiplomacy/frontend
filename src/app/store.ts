import { configureStore } from '@reduxjs/toolkit'
import filtersReducer from '../features/filters/filtersSlice'
import transactionsReducer from '../features/transactions/transactionsSlice'
import uiReducer from '../features/ui/uiSlice'
import { loadPersistedState, savePersistedState } from '../utils/storage'

const persisted = loadPersistedState()

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
  preloadedState: persisted
    ? {
        transactions: {
          items: persisted.transactions,
          status: 'succeeded' as const,
          error: null,
        },
        filters: persisted.filters,
        ui: {
          role: persisted.role,
          theme: persisted.theme,
        },
      }
    : undefined,
})

let persistTimeout: ReturnType<typeof setTimeout> | undefined

store.subscribe(() => {
  if (persistTimeout) {
    clearTimeout(persistTimeout)
  }

  persistTimeout = setTimeout(() => {
    const state = store.getState()

    savePersistedState({
      transactions: state.transactions.items,
      filters: state.filters,
      role: state.ui.role,
      theme: state.ui.theme,
    })
  }, 200)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
