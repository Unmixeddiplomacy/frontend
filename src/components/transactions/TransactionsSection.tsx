import { useMemo, useState } from 'react'
import {
  Download,
  Lock,
  Pencil,
  Plus,
  Save,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react'
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
  deleteTransaction,
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

interface InlineDraft {
  date: string
  description: string
  amount: string
  category: string
  type: 'income' | 'expense'
}

function getInlineDraft(transaction: Transaction): InlineDraft {
  return {
    date: transaction.date,
    description: transaction.description,
    amount: String(transaction.amount),
    category: transaction.category,
    type: transaction.type,
  }
}

export function TransactionsSection() {
  const dispatch = useAppDispatch()
  const role = useAppSelector((state) => state.ui.role)
  const filters = useAppSelector((state) => state.filters)
  const transactions = useAppSelector(selectFilteredTransactions)
  const categories = useAppSelector(selectUniqueCategories)

  const [openModal, setOpenModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [inlineDraft, setInlineDraft] = useState<InlineDraft | null>(null)
  const [inlineError, setInlineError] = useState<string | null>(null)

  const isAdmin = role === 'admin'
  const viewerReason = 'Viewer role is read-only. Switch to admin to edit or delete.'

  const subtitle = useMemo(() => {
    if (transactions.length === 0) {
      return 'No transactions match current filters.'
    }

    return `Showing ${transactions.length} transaction${transactions.length > 1 ? 's' : ''}`
  }, [transactions.length])

  function handleAddClick() {
    if (!isAdmin) {
      return
    }

    setOpenModal(true)
  }

  function handleStartInlineEdit(transaction: Transaction) {
    if (!isAdmin) {
      return
    }

    setEditingId(transaction.id)
    setInlineDraft(getInlineDraft(transaction))
    setInlineError(null)
  }

  function handleInlineCancel() {
    setEditingId(null)
    setInlineDraft(null)
    setInlineError(null)
  }

  function handleInlineSave() {
    if (!editingId || !inlineDraft) {
      return
    }

    if (
      !inlineDraft.date ||
      !inlineDraft.description.trim() ||
      !inlineDraft.category.trim()
    ) {
      setInlineError('Date, description, and category are required.')
      return
    }

    const amount = Number(inlineDraft.amount)
    if (Number.isNaN(amount) || amount <= 0) {
      setInlineError('Amount must be a positive number.')
      return
    }

    dispatch(
      updateTransaction({
        id: editingId,
        date: inlineDraft.date,
        description: inlineDraft.description.trim(),
        amount,
        category: inlineDraft.category.trim(),
        type: inlineDraft.type,
      }),
    )

    handleInlineCancel()
  }

  function handleDelete(transactionId: string) {
    if (!isAdmin) {
      return
    }

    const confirmed = window.confirm(
      'Delete this transaction? This action cannot be undone.',
    )

    if (!confirmed) {
      return
    }

    dispatch(deleteTransaction(transactionId))

    if (editingId === transactionId) {
      handleInlineCancel()
    }
  }

  function handleFormSubmit(transaction: Transaction) {
    dispatch(addTransaction(transaction))
    setOpenModal(false)
  }

  function handleModalClose() {
    setOpenModal(false)
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
            <Button
              variant={isAdmin ? 'primary' : 'secondary'}
              size="sm"
              className="gap-2"
              onClick={handleAddClick}
              disabled={!isAdmin}
              title={isAdmin ? 'Add transaction' : viewerReason}
            >
              {isAdmin ? <Plus size={14} /> : <Lock size={14} />} Add
            </Button>
          </>
        }
      />

      {!isAdmin ? (
        <p className="mb-3 inline-flex items-center gap-2 rounded-xl border border-amber-300/50 bg-amber-100/60 px-3 py-2 text-xs text-amber-800">
          <Lock size={14} /> Viewer mode is active: add, edit, and delete controls are disabled.
        </p>
      ) : (
        <p className="mb-3 inline-flex items-center gap-2 rounded-xl border border-emerald-300/50 bg-emerald-100/60 px-3 py-2 text-xs text-emerald-800">
          <Save size={14} /> Admin mode is active: inline edit and delete are enabled.
        </p>
      )}

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
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-t border-(--color-border) transition-colors duration-200 hover:bg-(--color-panel-soft)"
                >
                  {editingId === transaction.id && inlineDraft ? (
                    <>
                      <td className="px-4 py-3 text-(--color-text)">
                        <input
                          type="date"
                          value={inlineDraft.date}
                          onChange={(event) =>
                            setInlineDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    date: event.target.value,
                                  }
                                : prev,
                            )
                          }
                          className="h-9 w-full rounded-lg border border-(--color-border) bg-(--color-panel) px-2 text-xs outline-none focus:border-(--color-primary)"
                        />
                      </td>
                      <td className="px-4 py-3 text-(--color-heading)">
                        <input
                          type="text"
                          value={inlineDraft.description}
                          onChange={(event) =>
                            setInlineDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    description: event.target.value,
                                  }
                                : prev,
                            )
                          }
                          className="h-9 w-full rounded-lg border border-(--color-border) bg-(--color-panel) px-2 text-xs outline-none focus:border-(--color-primary)"
                        />
                      </td>
                      <td className="px-4 py-3 text-(--color-text)">
                        <input
                          type="text"
                          value={inlineDraft.category}
                          onChange={(event) =>
                            setInlineDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    category: event.target.value,
                                  }
                                : prev,
                            )
                          }
                          className="h-9 w-full rounded-lg border border-(--color-border) bg-(--color-panel) px-2 text-xs outline-none focus:border-(--color-primary)"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={inlineDraft.type}
                          onChange={(event) =>
                            setInlineDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    type: event.target.value as 'income' | 'expense',
                                  }
                                : prev,
                            )
                          }
                          className="h-9 w-full rounded-lg border border-(--color-border) bg-(--color-panel) px-2 text-xs outline-none focus:border-(--color-primary)"
                        >
                          <option value="income">income</option>
                          <option value="expense">expense</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 font-semibold text-(--color-heading)">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={inlineDraft.amount}
                          onChange={(event) =>
                            setInlineDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    amount: event.target.value,
                                  }
                                : prev,
                            )
                          }
                          className="h-9 w-full rounded-lg border border-(--color-border) bg-(--color-panel) px-2 text-xs outline-none focus:border-(--color-primary)"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" className="gap-1" onClick={handleInlineSave}>
                            <Save size={13} /> Save
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1"
                            onClick={handleInlineCancel}
                          >
                            <X size={13} /> Cancel
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
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
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1"
                            onClick={() => handleStartInlineEdit(transaction)}
                            disabled={!isAdmin}
                            title={isAdmin ? 'Inline edit transaction' : viewerReason}
                          >
                            <Pencil size={14} /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 text-rose-700 hover:bg-rose-100/70"
                            onClick={() => handleDelete(transaction.id)}
                            disabled={!isAdmin}
                            title={isAdmin ? 'Delete transaction' : viewerReason}
                          >
                            <Trash2 size={14} /> Delete
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {inlineError ? <p className="mt-2 text-sm text-(--color-danger)">{inlineError}</p> : null}

      {openModal ? (
        <TransactionFormModal
          key="new"
          mode="add"
          categories={categories}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
        />
      ) : null}
    </Card>
  )
}
