import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  Banknote,
  BarChart3,
  CalendarRange,
  PlusCircle,
  TrendingUp
} from 'lucide-react'

import { ExpenseForm } from './components/ExpenseForm'
import { Sidebar } from './components/Sidebar'
import { SummaryCard } from './components/SummaryCard'
import { Topbar } from './components/Topbar'
import { TransactionsTable } from './components/TransactionsTable'
import { expenseApi } from './lib/api'
import type { ExpensePayload, ExpenseRecord } from './types/expense'

const categoryOptions = ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Travel', 'Other']

function App() {
  const [items, setItems] = useState<ExpenseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formError, setFormError] = useState<Partial<Record<keyof ExpensePayload, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [filters, setFilters] = useState({ category: '', start_date: '', end_date: '' })

  const loadExpenses = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await expenseApi.list({
        page: 1,
        page_size: 50,
        category: filters.category || undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined
      })
      setItems(Array.isArray(data?.items) ? data.items : [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load expenses.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadExpenses()
  }, [filters.category, filters.start_date, filters.end_date])

  const safeItems = Array.isArray(items) ? items : []

  const summary = useMemo(() => {
    if (!safeItems.length) {
      return {
        totalSpent: '$0.00',
        transactionCount: 0,
        dailyAverage: '$0.00',
        topCategory: '—'
      }
    }

    const total = safeItems.reduce((sum, item) => sum + Number(item.amount), 0)
    const byCategory = safeItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount)
      return acc
    }, {})

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

    return {
      totalSpent: `$${total.toFixed(2)}`,
      transactionCount: safeItems.length,
      dailyAverage: `$${(total / Math.max(safeItems.length, 1)).toFixed(2)}`,
      topCategory: topCategory ? topCategory[0] : '—'
    }
  }, [safeItems])

  const validateForm = (values: ExpensePayload) => {
    const nextErrors: Partial<Record<keyof ExpensePayload, string>> = {}

    if (!values.amount || Number(values.amount) <= 0) {
      nextErrors.amount = 'Amount must be greater than zero.'
    }

    if (!values.category.trim()) {
      nextErrors.category = 'Category is required.'
    }

    if (!values.transaction_date) {
      nextErrors.transaction_date = 'Date is required.'
    }

    if (!values.description.trim()) {
      nextErrors.description = 'Description is required.'
    } else if (values.description.trim().length > 255) {
      nextErrors.description = 'Description must be 255 characters or fewer.'
    }

    return nextErrors
  }

  const resetForm = () => {
    setEditingId(null)
    setIsFormOpen(false)
    setFormError({})
  }

  const handleSubmit = async (values: ExpensePayload) => {
    const errors = validateForm(values)
    setFormError(errors)
    if (Object.keys(errors).length) {
      return
    }

    setSubmitting(true)
    try {
      if (editingId !== null) {
        await expenseApi.update(editingId, values)
      } else {
        await expenseApi.create(values)
      }
      resetForm()
      await loadExpenses()
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to save expense.'
      setFormError({
        ...formError,
        description: message
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (record: ExpenseRecord) => {
    try {
      await expenseApi.delete(record.id)
      await loadExpenses()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete expense.')
    }
  }

  const beginEdit = (record: ExpenseRecord) => {
    setEditingId(record.id)
    setIsFormOpen(true)
    setFormError({})
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-[1600px] flex-col xl:flex-row">
        <Sidebar />

        <main className="flex-1">
          <Topbar title="Dashboard" onNewExpense={() => {
            setEditingId(null)
            setIsFormOpen(true)
            setFormError({})
          }} />

          <div className="space-y-6 p-4 sm:p-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard title="Total Spent" value={summary.totalSpent} hint="Across current results" icon={<Banknote className="h-5 w-5" />} />
              <SummaryCard title="Transaction Count" value={String(summary.transactionCount)} hint="Visible expenses" icon={<BarChart3 className="h-5 w-5" />} />
              <SummaryCard title="Daily Average" value={summary.dailyAverage} hint="Per expense entry" icon={<TrendingUp className="h-5 w-5" />} />
              <SummaryCard title="Top Category" value={summary.topCategory} hint="Highest spend" icon={<ArrowUpRight className="h-5 w-5" />} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-950">Spending Overview</h2>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
                    <CalendarRange className="h-3.5 w-3.5" />
                    Last 30 days
                  </div>
                </div>
                <div className="h-64 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-full items-end gap-2">
                    {[35, 50, 42, 72, 60, 85, 68].map((height, index) => (
                      <div key={index} className="flex-1 rounded-t-xl bg-brand-500/80" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <h2 className="text-lg font-semibold text-slate-950">Category Spend</h2>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#10b981_0_35%,#34d399_35%_63%,#a7f3d0_63%_80%,#d1fae5_80%_100%)]">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center">
                      <div>
                        <div className="text-2xl font-semibold text-slate-950">$0</div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Spend</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  {categoryOptions.slice(0, 4).map((category, index) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={['h-2.5 w-2.5 rounded-full', index % 2 === 0 ? 'bg-brand-500' : 'bg-emerald-300'][0]} />
                        {category}
                      </div>
                      <span>{index * 12}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">Recent transactions</h2>
                    <p className="text-sm text-slate-500">Latest expenses from your backend</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select
                      aria-label="Category filter"
                      value={filters.category}
                      onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      <option value="">All categories</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <input
                      aria-label="Start date"
                      type="date"
                      value={filters.start_date}
                      onChange={(event) => setFilters((current) => ({ ...current, start_date: event.target.value }))}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    />
                    <input
                      aria-label="End date"
                      type="date"
                      value={filters.end_date}
                      onChange={(event) => setFilters((current) => ({ ...current, end_date: event.target.value }))}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">Loading expenses…</div>
                ) : error ? (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                ) : (
                  <TransactionsTable items={safeItems} onEdit={beginEdit} onDelete={handleDelete} />
                )}
              </div>

              <div>
                {isFormOpen ? (
                  <ExpenseForm
                    mode={editingId !== null ? 'edit' : 'create'}
                    initialValues={
                      editingId !== null && safeItems.find((item) => item.id === editingId)
                        ? {
                            amount: String(Number(safeItems.find((item) => item.id === editingId)?.amount ?? 0)),
                            category: safeItems.find((item) => item.id === editingId)?.category ?? 'Food',
                            description: safeItems.find((item) => item.id === editingId)?.description ?? '',
                            transaction_date: safeItems.find((item) => item.id === editingId)?.transaction_date ?? new Date().toISOString().slice(0, 10)
                          }
                        : undefined
                    }
                    submitLabel={editingId !== null ? 'Save changes' : 'Add expense'}
                    submitting={submitting}
                    errors={formError}
                    onCancel={resetForm}
                    onSubmit={handleSubmit}
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center shadow-soft">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                      <PlusCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Track a new expense</h3>
                    <p className="mt-2 text-sm text-slate-500">Create a new expense entry to keep your spending data accurate.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setIsFormOpen(true)
                        setFormError({})
                      }}
                      className="mt-4 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600"
                    >
                      Add expense
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
