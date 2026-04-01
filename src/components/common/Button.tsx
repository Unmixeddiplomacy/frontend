import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] focus-visible:ring-[var(--color-primary)]',
        secondary:
          'bg-[var(--color-panel)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-panel-soft)] focus-visible:ring-[var(--color-primary)]',
        ghost:
          'text-[var(--color-text)] hover:bg-[var(--color-panel-soft)] focus-visible:ring-[var(--color-primary)]',
        danger:
          'bg-[var(--color-danger)] text-white hover:brightness-95 focus-visible:ring-[var(--color-danger)]',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
