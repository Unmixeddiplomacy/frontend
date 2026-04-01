import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ThemeMode, UserRole } from '../../types/finance'

interface UiState {
  role: UserRole
  theme: ThemeMode
}

const getDefaultTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const initialState: UiState = {
  role: 'viewer',
  theme: getDefaultTheme(),
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<UserRole>) {
      state.role = action.payload
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload
    },
  },
})

export const { setRole, toggleTheme, setTheme } = uiSlice.actions

export default uiSlice.reducer
