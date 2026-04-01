import { TrendingUp } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAppSelector } from '../../app/hooks'
import { selectMonthlyTrend } from '../../features/selectors/dashboardSelectors'
import { formatCurrency, formatMonth } from '../../utils/format'
import { Card } from '../common/Card'
import { EmptyState } from '../common/EmptyState'
import { SectionHeader } from '../common/SectionHeader'

export function BalanceTrendChart() {
  const trend = useAppSelector(selectMonthlyTrend)

  if (trend.length === 0) {
    return (
      <Card>
        <SectionHeader
          eyebrow="Overview"
          title="Balance Trend"
          subtitle="Track monthly progression of income and expenses"
        />
        <EmptyState
          icon={<TrendingUp size={24} />}
          title="No trend data yet"
          description="Add transactions to see balance movement over time."
        />
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: '140ms' }}>
      <SectionHeader
        eyebrow="Overview"
        title="Balance Trend"
        subtitle="Monthly movement of balance based on income and expenses"
      />
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => formatMonth(`${value}-01`)}
              stroke="var(--color-muted)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="var(--color-muted)" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                background: 'var(--color-panel)',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.14)',
              }}
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              labelFormatter={(label) => formatMonth(`${label}-01`)}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--color-primary)"
              fillOpacity={1}
              fill="url(#balanceGradient)"
              strokeWidth={3}
              activeDot={{ r: 5, strokeWidth: 0, fill: 'var(--color-primary-strong)' }}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
