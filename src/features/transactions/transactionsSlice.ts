import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchTransactionsApi } from '../../services/mockApi'
import type { Transaction } from '../../types/finance'

interface TransactionsState {
  items: Transaction[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: TransactionsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    const response = await fetchTransactionsApi()
    return response
  },
)

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.items.unshift(action.payload)
    },
    updateTransaction(state, action: PayloadAction<Transaction>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index >= 0) {
        state.items[index] = action.payload
      }
    },
    replaceTransactions(state, action: PayloadAction<Transaction[]>) {
      state.items = action.payload
      state.status = 'succeeded'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load transactions'
      })
  },
})

export const { addTransaction, updateTransaction, replaceTransactions } =
  transactionsSlice.actions

export default transactionsSlice.reducer
