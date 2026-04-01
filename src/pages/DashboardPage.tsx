import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchTransactions } from '../features/transactions/transactionsSlice'
import { BalanceTrendChart } from '../components/dashboard/BalanceTrendChart'
import { SpendingBreakdownChart } from '../components/dashboard/SpendingBreakdownChart'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { TransactionsSection } from '../components/transactions/TransactionsSection'
import { InsightsSection } from '../components/insights/InsightsSection'
import { AppShell } from '../components/layout/AppShell'
import { RoleSwitcher } from '../components/controls/RoleSwitcher'
import { ThemeToggle } from '../components/controls/ThemeToggle'
import { LoadingSkeleton } from '../components/common/LoadingSkeleton'
import { ErrorState } from '../components/common/ErrorState'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const { status, error, items } = useAppSelector((state) => state.transactions)
  const role = useAppSelector((state) => state.ui.role)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTransactions())
    }
  }, [dispatch, status])

  return (
    <AppShell
      title="Finance Command Center"
      subtitle="Track cash flow, inspect spending patterns, and make faster decisions with role-aware controls."
      controls={
        <>
          <RoleSwitcher />
          <ThemeToggle />
        </>
      }
    >
      {role === 'viewer' ? (
        <p className="mb-4 rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-2 text-sm text-(--color-muted)">
          Viewer mode: all transaction mutations are disabled. Switch to admin for add, inline edit, and delete actions.
        </p>
      ) : (
        <p className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-100/50 px-4 py-2 text-sm text-emerald-700">
          Admin mode enabled. You can add transactions, edit rows inline, and delete records.
        </p>
      )}

      {status === 'loading' && items.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : null}

      {status === 'failed' ? (
        <ErrorState
          title="Could not load transaction data"
          description={error ?? 'Unknown API issue occurred in mock data layer.'}
          onRetry={() => dispatch(fetchTransactions())}
        />
      ) : null}

      {status !== 'failed' && !(status === 'loading' && items.length === 0) ? (
        <div className="space-y-5">
          <SummaryCards />
          <section className="grid gap-5 xl:grid-cols-2">
            <BalanceTrendChart />
            <SpendingBreakdownChart />
          </section>
          <TransactionsSection />
          <InsightsSection />
        </div>
      ) : null}
    </AppShell>
  )
}
