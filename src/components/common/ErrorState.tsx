import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  title: string
  description: string
  onRetry?: () => void
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-(--color-border) bg-(--color-panel-soft) px-6 text-center">
      <AlertCircle className="text-(--color-danger)" size={24} />
      <h3 className="font-heading text-xl text-(--color-heading)">{title}</h3>
      <p className="max-w-md text-sm text-(--color-muted)">{description}</p>
      {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    </div>
  )
}
