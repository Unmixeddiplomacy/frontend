import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import { useAppSelector } from '../../app/hooks'
import { selectSummary } from '../../features/selectors/dashboardSelectors'
import { formatCurrency } from '../../utils/format'
import { Card } from '../common/Card'

const CARD_META = [
  {
    label: 'Total Balance',
    key: 'balance',
    icon: Wallet,
  },
  {
    label: 'Income',
    key: 'income',
    icon: ArrowUpRight,
  },
  {
    label: 'Expenses',
    key: 'expenses',
    icon: ArrowDownRight,
  },
] as const

export function SummaryCards() {
  const summary = useAppSelector(selectSummary)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {CARD_META.map((card, index) => {
        const value = summary[card.key]
        const Icon = card.icon

        return (
          <Card
            key={card.label}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-(--color-muted)">{card.label}</p>
              <span className="rounded-lg bg-(--color-panel-soft) p-2 text-(--color-primary)">
                <Icon size={18} />
              </span>
            </div>
            <p className="mt-3 font-heading text-3xl text-(--color-heading)">
              {formatCurrency(value)}
            </p>
            <p className="mt-2 text-xs text-(--color-muted)">
              Updated from latest transactions
            </p>
          </Card>
        )
      })}
    </div>
  )
}
