import type { FormEvent } from 'react'

import type { ExpensePayload } from '../types/expense'

interface ExpenseFormProps {
  mode: 'create' | 'edit'
  initialValues?: ExpensePayload
  submitLabel: string
  onSubmit: (values: ExpensePayload) => void
  onCancel?: () => void
  submitting?: boolean
  errors?: Partial<Record<keyof ExpensePayload, string>>
}

const defaultValues: ExpensePayload = {
  amount: '',
  category: 'Food',
  description: '',
  transaction_date: new Date().toISOString().slice(0, 10)
}

export function ExpenseForm({
  mode,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  submitting = false,
  errors = {}
}: ExpenseFormProps) {
  const values = {
    ...defaultValues,
    ...initialValues
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const nextValues: ExpensePayload = {
      amount: String(formData.get('amount') ?? ''),
      category: String(formData.get('category') ?? ''),
      description: String(formData.get('description') ?? ''),
      transaction_date: String(formData.get('transaction_date') ?? '')
    }

    onSubmit(nextValues)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-xl font-semibold text-slate-950">{mode === 'create' ? 'Add expense' : 'Edit expense'}</h2>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-500 hover:text-slate-800">
            Cancel
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-1">
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={values.amount}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 placeholder:text-slate-400"
            aria-invalid={Boolean(errors.amount)}
          />
          {errors.amount ? <p className="mt-1 text-sm text-red-600">{errors.amount}</p> : null}
        </div>

        <div className="md:col-span-1">
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={values.category}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900"
            aria-invalid={Boolean(errors.category)}
          >
            <option value="Housing">Housing</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
            <option value="Other">Other</option>
          </select>
          {errors.category ? <p className="mt-1 text-sm text-red-600">{errors.category}</p> : null}
        </div>

        <div className="md:col-span-1">
          <label htmlFor="transaction_date" className="mb-1.5 block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            id="transaction_date"
            name="transaction_date"
            type="date"
            defaultValue={values.transaction_date}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900"
            aria-invalid={Boolean(errors.transaction_date)}
          />
          {errors.transaction_date ? <p className="mt-1 text-sm text-red-600">{errors.transaction_date}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            maxLength={255}
            defaultValue={values.description}
            placeholder="Groceries, rent, taxi, etc."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 placeholder:text-slate-400"
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description ? <p className="mt-1 text-sm text-red-600">{errors.description}</p> : null}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={submitting} className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
