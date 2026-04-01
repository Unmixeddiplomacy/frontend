import type { ReactNode } from 'react'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="type-title font-heading text-(--color-heading)">{title}</h2>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-(--color-muted)">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  )
}
