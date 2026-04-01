import { Shield, UserRound } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setRole } from '../../features/ui/uiSlice'
import type { UserRole } from '../../types/finance'

export function RoleSwitcher() {
  const dispatch = useAppDispatch()
  const role = useAppSelector((state) => state.ui.role)

  return (
    <label className="group flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-panel) px-3 py-2 text-sm text-(--color-text) shadow-sm transition-all duration-200 hover:border-(--color-primary)">
      {role === 'admin' ? <Shield size={16} /> : <UserRound size={16} />}
      <span className="hidden sm:inline">Role</span>
      <select
        value={role}
        onChange={(event) => dispatch(setRole(event.target.value as UserRole))}
        className="bg-transparent text-sm font-semibold outline-none"
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </label>
  )
}
