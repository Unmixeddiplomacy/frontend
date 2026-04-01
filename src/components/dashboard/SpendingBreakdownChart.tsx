import { useState } from 'react'
import { PieChart as PieChartIcon } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useAppSelector } from '../../app/hooks'
import { selectCategoryBreakdown } from '../../features/selectors/dashboardSelectors'
import { formatCurrency, formatPercent } from '../../utils/format'
import { Card } from '../common/Card'
import { EmptyState } from '../common/EmptyState'
import { SectionHeader } from '../common/SectionHeader'

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']

export function SpendingBreakdownChart() {
  const breakdown = useAppSelector(selectCategoryBreakdown)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (breakdown.length === 0) {
    return (
      <Card>
        <SectionHeader
          eyebrow="Overview"
          title="Spending Breakdown"
          subtitle="Category share of total expenses"
        />
        <EmptyState
          icon={<PieChartIcon size={24} />}
          title="No expense categories yet"
          description="Expense transactions will appear here once available."
        />
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: '220ms' }}>
      <SectionHeader
        eyebrow="Overview"
        title="Spending Breakdown"
        subtitle="How your expenses are distributed by category"
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-center">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={60}
                paddingAngle={3}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              >
                {breakdown.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[index % COLORS.length]}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, item) => {
                  const amount = Number(value ?? 0)
                  const percentage = Number(item?.payload?.percentage ?? 0)
                  return `${formatCurrency(amount)} (${formatPercent(percentage)})`
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-panel)',
                  boxShadow: '0 10px 28px rgba(0, 0, 0, 0.14)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2">
          {breakdown.map((item, index) => (
            <li
              key={item.category}
              className="flex items-center justify-between rounded-lg bg-(--color-panel-soft) px-3 py-2 text-sm transition-all duration-200 hover:translate-x-1 hover:bg-(--color-panel)"
            >
              <span className="inline-flex items-center gap-2 text-(--color-text)">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {item.category}
              </span>
              <strong className="text-(--color-heading)">{formatCurrency(item.amount)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
