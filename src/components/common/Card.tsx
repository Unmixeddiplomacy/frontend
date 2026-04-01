import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-(--radius-card) border border-(--color-border) bg-(--color-panel) p-(--space-6) shadow-(--shadow-soft) transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(17,56,74,0.14)]',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}
