import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { FinanceFilters } from '../../types/finance'

const initialState: FinanceFilters = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date',
  sortDirection: 'desc',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setTypeFilter(state, action: PayloadAction<FinanceFilters['type']>) {
      state.type = action.payload
    },
    setCategoryFilter(state, action: PayloadAction<FinanceFilters['category']>) {
      state.category = action.payload
    },
    setSortBy(state, action: PayloadAction<FinanceFilters['sortBy']>) {
      state.sortBy = action.payload
    },
    toggleSortDirection(state) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
    },
    resetFilters() {
      return initialState
    },
    replaceFilters(_state, action: PayloadAction<FinanceFilters>) {
      return action.payload
    },
  },
})

export const {
  setSearch,
  setTypeFilter,
  setCategoryFilter,
  setSortBy,
  toggleSortDirection,
  resetFilters,
  replaceFilters,
} = filtersSlice.actions

export default filtersSlice.reducer
