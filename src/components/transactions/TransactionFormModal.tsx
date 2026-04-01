import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import type { Transaction } from '../../types/finance'
import { Button } from '../common/Button'

interface TransactionFormModalProps {
  mode: 'add' | 'edit'
  categories: string[]
  initialTransaction?: Transaction
  onClose: () => void
  onSubmit: (transaction: Transaction) => void
}

interface FormState {
  date: string
  description: string
  amount: string
  category: string
  type: 'income' | 'expense'
}

const defaultFormState: FormState = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  amount: '',
  category: '',
  type: 'expense',
}

function getInitialFormState(initialTransaction?: Transaction): FormState {
  if (!initialTransaction) {
    return defaultFormState
  }

  return {
    date: initialTransaction.date,
    description: initialTransaction.description,
    amount: initialTransaction.amount.toString(),
    category: initialTransaction.category,
    type: initialTransaction.type,
  }
}

export function TransactionFormModal({
  mode,
  categories,
  initialTransaction,
  onClose,
  onSubmit,
}: TransactionFormModalProps) {
  const [form, setForm] = useState<FormState>(() =>
    getInitialFormState(initialTransaction),
  )
  const [error, setError] = useState<string | null>(null)

  const allCategories = useMemo(() => {
    const seed = [
      'Salary',
      'Freelance',
      'Rent',
      'Groceries',
      'Utilities',
      'Dining',
      'Transport',
      'Health',
      'Entertainment',
      'Tax',
    ]

    return [...new Set([...seed, ...categories])]
  }, [categories])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.date || !form.description.trim() || !form.category.trim()) {
      setError('Please fill in date, description, and category.')
      return
    }

    const amount = Number(form.amount)
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number.')
      return
    }

    setError(null)

    onSubmit({
      id: initialTransaction?.id ?? crypto.randomUUID(),
      date: form.date,
      description: form.description.trim(),
      amount,
      category: form.category.trim(),
      type: form.type,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-modal-in rounded-2xl border border-(--color-border) bg-(--color-panel) p-5 shadow-(--shadow-soft)">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-2xl text-(--color-heading)">
              {mode === 'add' ? 'Add transaction' : 'Edit transaction'}
            </h3>
            <p className="text-sm text-(--color-muted)">
              {mode === 'add'
                ? 'Create a new transaction record.'
                : 'Update fields and save your changes.'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm text-(--color-text)">
              Date
              <input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, date: event.target.value }))
                }
                className="h-10 rounded-xl border border-(--color-border) bg-transparent px-3 outline-none focus:border-(--color-primary)"
              />
            </label>

            <label className="grid gap-1 text-sm text-(--color-text)">
              Type
              <select
                value={form.type}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    type: event.target.value as FormState['type'],
                  }))
                }
                className="h-10 rounded-xl border border-(--color-border) bg-transparent px-3 outline-none focus:border-(--color-primary)"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1 text-sm text-(--color-text)">
            Description
            <input
              type="text"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="e.g. Monthly salary"
              className="h-10 rounded-xl border border-(--color-border) bg-transparent px-3 outline-none focus:border-(--color-primary)"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm text-(--color-text)">
              Category
              <input
                list="category-options"
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, category: event.target.value }))
                }
                placeholder="e.g. Rent"
                className="h-10 rounded-xl border border-(--color-border) bg-transparent px-3 outline-none focus:border-(--color-primary)"
              />
              <datalist id="category-options">
                {allCategories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>

            <label className="grid gap-1 text-sm text-(--color-text)">
              Amount
              <input
                type="number"
                min="0"
                step="1"
                value={form.amount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, amount: event.target.value }))
                }
                placeholder="0"
                className="h-10 rounded-xl border border-(--color-border) bg-transparent px-3 outline-none focus:border-(--color-primary)"
              />
            </label>
          </div>

          {error ? <p className="text-sm text-(--color-danger)">{error}</p> : null}

          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{mode === 'add' ? 'Add' : 'Save changes'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
