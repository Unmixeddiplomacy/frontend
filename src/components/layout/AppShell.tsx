import type { ReactNode } from 'react'

interface AppShellProps {
  title: string
  subtitle: string
  controls?: ReactNode
  children: ReactNode
}

export function AppShell({ title, subtitle, controls, children }: AppShellProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-7 sm:px-6 lg:px-8 lg:pt-11">
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="animate-fade-in-up">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-(--color-muted)">
            Finance Intelligence
          </p>
          <h1 className="type-display font-heading leading-[1.08] text-(--color-heading)">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-(--color-muted) sm:text-base">
            {subtitle}
          </p>
        </div>
        {controls ? <div className="flex flex-wrap gap-2.5">{controls}</div> : null}
      </header>
      <main>{children}</main>
    </div>
  )
}
