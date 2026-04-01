import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-(--color-border) bg-(--color-panel-soft) px-6 text-center">
      {icon ? <div className="text-(--color-primary)">{icon}</div> : null}
      <h3 className="font-heading text-xl text-(--color-heading)">{title}</h3>
      <p className="max-w-sm text-sm text-(--color-muted)">{description}</p>
    </div>
  )
}
