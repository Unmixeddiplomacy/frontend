import { AlertTriangle, CircleDot, TrendingDown, TrendingUp } from 'lucide-react'
import { useAppSelector } from '../../app/hooks'
import { selectInsights } from '../../features/selectors/dashboardSelectors'
import { formatCurrency } from '../../utils/format'
import { Card } from '../common/Card'
import { SectionHeader } from '../common/SectionHeader'

export function InsightsSection() {
  const insights = useAppSelector(selectInsights)

  const movementIcon =
    insights.monthlyChangePercent >= 0 ? (
      <TrendingUp size={16} className="text-amber-500" />
    ) : (
      <TrendingDown size={16} className="text-emerald-500" />
    )

  const spendingChangeAbs = Math.abs(insights.monthlyChangePercent * 100).toFixed(1)

  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: '380ms' }}>
      <SectionHeader
        eyebrow="Insights"
        title="Smart Observations"
        subtitle="Quick interpretation of current financial activity"
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-(--color-border) bg-(--color-panel-soft) p-4">
          <p className="text-xs uppercase tracking-wide text-(--color-muted)">
            Highest Spend Category
          </p>
          <h3 className="mt-2 font-heading text-xl text-(--color-heading)">
            {insights.highestSpendingCategory}
          </h3>
          <p className="mt-1 text-sm text-(--color-text)">
            {formatCurrency(insights.highestSpendingAmount)} total expense
          </p>
        </article>

        <article className="rounded-xl border border-(--color-border) bg-(--color-panel-soft) p-4">
          <p className="text-xs uppercase tracking-wide text-(--color-muted)">
            Monthly Expense Shift
          </p>
          <h3 className="mt-2 inline-flex items-center gap-2 font-heading text-xl text-(--color-heading)">
            {movementIcon}
            {spendingChangeAbs}% {insights.monthlyChangeLabel}
          </h3>
          <p className="mt-1 text-sm text-(--color-text)">
            Compared to previous month
          </p>
        </article>

        <article className="rounded-xl border border-(--color-border) bg-(--color-panel-soft) p-4">
          <p className="text-xs uppercase tracking-wide text-(--color-muted)">
            Net Savings Rate
          </p>
          <h3 className="mt-2 font-heading text-xl text-(--color-heading)">
            {insights.netSavingsRate.toFixed(1)}%
          </h3>
          <p className="mt-1 text-sm text-(--color-text)">
            Portion of income retained after expenses
          </p>
        </article>

        <article className="rounded-xl border border-(--color-border) bg-(--color-panel-soft) p-4">
          <p className="text-xs uppercase tracking-wide text-(--color-muted)">
            Observation
          </p>
          <h3 className="mt-2 inline-flex items-center gap-2 font-heading text-lg text-(--color-heading)">
            <CircleDot size={15} className="text-(--color-primary)" />
            {insights.totalTransactions} entries tracked
          </h3>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-(--color-text)">
            <AlertTriangle size={14} className="text-amber-500" />
            Keep an eye on recurring fixed costs.
          </p>
        </article>
      </div>
    </Card>
  )
}
