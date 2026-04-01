import { Moon, Sun } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { toggleTheme } from '../../features/ui/uiSlice'
import { Button } from '../common/Button'

export function ThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.ui.theme)

  return (
    <Button
      variant="secondary"
      onClick={() => dispatch(toggleTheme())}
      className="gap-2"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">
        {theme === 'dark' ? 'Light' : 'Dark'} mode
      </span>
    </Button>
  )
}
