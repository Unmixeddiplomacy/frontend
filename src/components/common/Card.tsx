import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-(--color-border) bg-(--color-panel) p-5 shadow-(--shadow-soft)',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}
