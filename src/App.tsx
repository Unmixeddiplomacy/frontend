import { useEffect } from 'react'
import { useAppSelector } from './app/hooks'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return <DashboardPage />
}

export default App
