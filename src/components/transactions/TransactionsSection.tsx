import { useMemo, useState } from 'react'
import { Download, Pencil, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  selectFilteredTransactions,
  selectUniqueCategories,
} from '../../features/selectors/dashboardSelectors'
import {
  resetFilters,
  setCategoryFilter,
  setSearch,
  setSortBy,
  setTypeFilter,
  toggleSortDirection,
} from '../../features/filters/filtersSlice'
import {
  addTransaction,
  updateTransaction,
} from '../../features/transactions/transactionsSlice'
import type { Transaction } from '../../types/finance'
import { exportTransactionsToCsv, exportTransactionsToJson } from '../../utils/export'
import { formatCurrency, formatDate } from '../../utils/format'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { EmptyState } from '../common/EmptyState'
import { SectionHeader } from '../common/SectionHeader'
import { TransactionFormModal } from './TransactionFormModal'

export function TransactionsSection() {
  const dispatch = useAppDispatch()
  const role = useAppSelector((state) => state.ui.role)
  const filters = useAppSelector((state) => state.filters)
  const transactions = useAppSelector(selectFilteredTransactions)
  const categories = useAppSelector(selectUniqueCategories)

  const [openModal, setOpenModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Transaction | undefined>(
    undefined,
  )

  const isAdmin = role === 'admin'

  const subtitle = useMemo(() => {
    if (transactions.length === 0) {
      return 'No transactions match current filters.'
    }

    return `Showing ${transactions.length} transaction${transactions.length > 1 ? 's' : ''}`
  }, [transactions.length])

  function handleAddClick() {
    setEditingItem(undefined)
    setOpenModal(true)
  }

  function handleEditClick(transaction: Transaction) {
    setEditingItem(transaction)
    setOpenModal(true)
  }

  function handleFormSubmit(transaction: Transaction) {
    if (editingItem) {
      dispatch(updateTransaction(transaction))
    } else {
      dispatch(addTransaction(transaction))
    }

    setOpenModal(false)
    setEditingItem(undefined)
  }

  function handleModalClose() {
    setOpenModal(false)
    setEditingItem(undefined)
  }

  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <SectionHeader
        eyebrow="Transactions"
        title="Activity Ledger"
        subtitle={subtitle}
        action={
          <>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => exportTransactionsToCsv(transactions)}
              disabled={transactions.length === 0}
            >
              <Download size={14} /> CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => exportTransactionsToJson(transactions)}
              disabled={transactions.length === 0}
            >
              <Download size={14} /> JSON
            </Button>
            {isAdmin ? (
              <Button size="sm" className="gap-2" onClick={handleAddClick}>
                <Plus size={14} /> Add
              </Button>
            ) : null}
          </>
        }
      />

      <div className="mb-4 grid gap-3 rounded-xl border border-(--color-border) bg-(--color-panel-soft) p-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="xl:col-span-2">
          <span className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-(--color-muted)">
            <Search size={13} /> Search
          </span>
          <input
            type="text"
            value={filters.search}
            placeholder="Description or category"
            onChange={(event) => dispatch(setSearch(event.target.value))}
            className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-panel) px-3 text-sm outline-none focus:border-(--color-primary)"
          />
        </label>

        <label>
          <span className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-(--color-muted)">
            <SlidersHorizontal size={13} /> Type
          </span>
          <select
            value={filters.type}
            onChange={(event) =>
              dispatch(setTypeFilter(event.target.value as typeof filters.type))
            }
            className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-panel) px-3 text-sm outline-none focus:border-(--color-primary)"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label>
          <span className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-(--color-muted)">
            Category
          </span>
          <select
            value={filters.category}
            onChange={(event) => dispatch(setCategoryFilter(event.target.value))}
            className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-panel) px-3 text-sm outline-none focus:border-(--color-primary)"
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <label>
            <span className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-(--color-muted)">
              Sort by
            </span>
            <select
              value={filters.sortBy}
              onChange={(event) =>
                dispatch(setSortBy(event.target.value as typeof filters.sortBy))
              }
              className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-panel) px-3 text-sm outline-none focus:border-(--color-primary)"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </label>
          <Button
            variant="secondary"
            size="sm"
            className="mt-5"
            onClick={() => dispatch(toggleSortDirection())}
          >
            {filters.sortDirection === 'asc' ? 'Asc' : 'Desc'}
          </Button>
        </div>
      </div>

      <div className="mb-3 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => dispatch(resetFilters())}>
          Reset filters
        </Button>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Try adjusting your filters or add a new transaction if you are in admin mode."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-(--color-border)">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-(--color-panel-soft) text-xs uppercase tracking-wide text-(--color-muted)">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                {isAdmin ? <th className="px-4 py-3">Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-(--color-border)">
                  <td className="px-4 py-3 text-(--color-text)">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-3 text-(--color-heading)">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-3 text-(--color-text)">
                    {transaction.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        transaction.type === 'income'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-(--color-heading)">
                    {formatCurrency(transaction.amount)}
                  </td>
                  {isAdmin ? (
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                        onClick={() => handleEditClick(transaction)}
                      >
                        <Pencil size={14} /> Edit
                      </Button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openModal ? (
        <TransactionFormModal
          key={editingItem?.id ?? 'new'}
          mode={editingItem ? 'edit' : 'add'}
          categories={categories}
          initialTransaction={editingItem}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
        />
      ) : null}
    </Card>
  )
}
