import { AlertTriangle, CircleDot, TrendingDown, TrendingUp } from 'lucide-react'
import { useAppSelector } from '../../app/hooks'
import { selectInsights } from '../../features/selectors/dashboardSelectors'
import { formatCurrency, formatMonth, formatPercent } from '../../utils/format'
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

  const hasPreviousMonth = insights.previousMonthLabel !== 'N/A'
  const previousMonthText = hasPreviousMonth
    ? formatMonth(`${insights.previousMonthLabel}-01`)
    : 'previous month'

  const spendingIntel = !hasPreviousMonth
    ? 'Add one more month of records to unlock month-over-month spending intelligence.'
    : insights.spendingDirection === 'up'
      ? `Your spending increased by ${formatPercent(Math.abs(insights.spendingDeltaPercent))} (${formatCurrency(Math.abs(insights.spendingDeltaAmount))}) versus ${previousMonthText}.`
      : insights.spendingDirection === 'down'
        ? `Your spending dropped by ${formatPercent(Math.abs(insights.spendingDeltaPercent))} (${formatCurrency(Math.abs(insights.spendingDeltaAmount))}) versus ${previousMonthText}.`
        : `Spending stayed flat versus ${previousMonthText}.`

  const savingsIntel = !hasPreviousMonth
    ? 'Savings comparison will appear once at least two months are available.'
    : insights.savingsDirection === 'up'
      ? `You saved ${formatCurrency(Math.abs(insights.savingsDeltaAmount))} more compared to ${previousMonthText}.`
      : insights.savingsDirection === 'down'
        ? `You saved ${formatCurrency(Math.abs(insights.savingsDeltaAmount))} less compared to ${previousMonthText}.`
        : `Savings are unchanged compared to ${previousMonthText}.`

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
            Spending Intelligence
          </p>
          <h3 className="mt-2 inline-flex items-center gap-2 font-heading text-xl text-(--color-heading)">
            {movementIcon}
            {insights.monthlyChangeLabel === 'n/a'
              ? 'Not enough data yet'
              : `${formatPercent(Math.abs(insights.monthlyChangePercent))} ${insights.monthlyChangeLabel}`}
          </h3>
          <p className="mt-2 text-sm text-(--color-text)">{spendingIntel}</p>
        </article>

        <article className="rounded-xl border border-(--color-border) bg-(--color-panel-soft) p-4">
          <p className="text-xs uppercase tracking-wide text-(--color-muted)">
            Savings Intelligence
          </p>
          <h3 className="mt-2 inline-flex items-center gap-2 font-heading text-xl text-(--color-heading)">
            {insights.savingsDirection === 'down' ? (
              <TrendingDown size={16} className="text-rose-500" />
            ) : (
              <TrendingUp size={16} className="text-emerald-500" />
            )}
            {formatCurrency(Math.abs(insights.savingsDeltaAmount))}
          </h3>
          <p className="mt-2 text-sm text-(--color-text)">{savingsIntel}</p>
        </article>

        <article className="rounded-xl border border-(--color-border) bg-(--color-panel-soft) p-4">
          <p className="text-xs uppercase tracking-wide text-(--color-muted)">
            Category Risk Signal
          </p>
          <h3 className="mt-2 font-heading text-xl text-(--color-heading)">
            {insights.highestSpendingCategory}
          </h3>
          <p className="mt-1 text-sm text-(--color-text)">
            {formatCurrency(insights.highestSpendingAmount)} ({formatPercent(insights.topCategoryShare)}) of total spend
          </p>
        </article>

        <article className="rounded-xl border border-(--color-border) bg-(--color-panel-soft) p-4">
          <p className="text-xs uppercase tracking-wide text-(--color-muted)">
            Recommended Focus
          </p>
          <h3 className="mt-2 inline-flex items-center gap-2 font-heading text-lg text-(--color-heading)">
            <CircleDot size={15} className="text-(--color-primary)" />
            Net savings rate: {insights.netSavingsRate.toFixed(1)}%
          </h3>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-(--color-text)">
            <AlertTriangle size={14} className="text-amber-500" />
            {insights.recommendedFocus}
          </p>
        </article>
      </div>

      <p className="mt-4 text-xs text-(--color-muted)">
        Based on {insights.totalTransactions} transactions in your current dataset.
      </p>
    </Card>
  )
}
