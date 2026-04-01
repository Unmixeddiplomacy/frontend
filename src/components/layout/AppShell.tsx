import type { ReactNode } from 'react'

interface AppShellProps {
  title: string
  subtitle: string
  controls?: ReactNode
  children: ReactNode
}

export function AppShell({ title, subtitle, controls, children }: AppShellProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-10">
      <header className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="animate-fade-in-up">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-(--color-muted)">
            Finance Intelligence
          </p>
          <h1 className="font-heading text-4xl leading-tight text-(--color-heading) sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-(--color-muted) sm:text-base">
            {subtitle}
          </p>
        </div>
        {controls ? <div className="flex flex-wrap gap-2">{controls}</div> : null}
      </header>
      <main>{children}</main>
    </div>
  )
}
