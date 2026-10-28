import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowRightLeft,
  Banknote,
  BarChart3,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Pencil,
  Plus,
  ReceiptText,
  ShoppingBag,
  Target,
  Trash2,
  TrendingUp,
  Wallet,
  Zap
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { ExpenseForm } from './components/ExpenseForm'
import { Sidebar } from './components/Sidebar'
import { SummaryCard } from './components/SummaryCard'
import { Topbar } from './components/Topbar'
import { expenseApi } from './lib/api'
import type { ExpensePayload, ExpenseRecord } from './types/expense'

const categoryOptions = ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Travel', 'Other']
const chartPalette = ['#10b981', '#34d399', '#8b5cf6', '#fbbf24', '#f472b6', '#38bdf8']

const seededExpenses: ExpenseRecord[] = [
  { id: 1, amount: '250.50', category: 'Food', description: 'Lunch at Cafe', transaction_date: '2026-10-27', created_at: '2026-10-27T00:00:00Z', updated_at: '2026-10-27T00:00:00Z' },
  { id: 2, amount: '60.00', category: 'Transport', description: 'Bus Ticket', transaction_date: '2026-10-26', created_at: '2026-10-26T00:00:00Z', updated_at: '2026-10-26T00:00:00Z' },
  { id: 3, amount: '499.00', category: 'Utilities', description: 'Monthly Subscription', transaction_date: '2026-10-25', created_at: '2026-10-25T00:00:00Z', updated_at: '2026-10-25T00:00:00Z' },
  { id: 4, amount: '1200.00', category: 'Shopping', description: 'Grocery Items', transaction_date: '2026-10-24', created_at: '2026-10-24T00:00:00Z', updated_at: '2026-10-24T00:00:00Z' },
  { id: 5, amount: '1800.00', category: 'Utilities', description: 'Electricity Bill', transaction_date: '2026-10-23', created_at: '2026-10-23T00:00:00Z', updated_at: '2026-10-23T00:00:00Z' },
  { id: 6, amount: '350.00', category: 'Food', description: 'Dinner with team', transaction_date: '2026-10-20', created_at: '2026-10-20T00:00:00Z', updated_at: '2026-10-20T00:00:00Z' },
  { id: 7, amount: '2700.00', category: 'Travel', description: 'Flight booking', transaction_date: '2026-10-18', created_at: '2026-10-18T00:00:00Z', updated_at: '2026-10-18T00:00:00Z' },
  { id: 8, amount: '1200.00', category: 'Health', description: 'Pharmacy', transaction_date: '2026-10-12', created_at: '2026-10-12T00:00:00Z', updated_at: '2026-10-12T00:00:00Z' }
]

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function App() {
  const [items, setItems] = useState<ExpenseRecord[]>(seededExpenses)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formError, setFormError] = useState<Partial<Record<keyof ExpensePayload, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
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

      const nextItems = Array.isArray(data?.items) ? data.items : []
      setItems(nextItems)
      if (!nextItems.length) {
        setError('No expenses found.')
      }
    } catch (loadError) {
      setItems(seededExpenses)
      setError(loadError instanceof Error ? loadError.message : 'Unable to load expenses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadExpenses()
  }, [filters.category, filters.start_date, filters.end_date])

  const visibleItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return items
    }

    return items.filter((item) => {
      const haystack = `${item.description} ${item.category}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [items, searchTerm])

  const summary = useMemo(() => {
    const source = visibleItems.length ? visibleItems : items

    if (!source.length) {
      return {
        totalSpent: '₹0',
        transactionCount: 0,
        dailyAverage: '₹0',
        topCategory: '—'
      }
    }

    const totalSpent = source.reduce((sum, item) => sum + Number(item.amount), 0)
    const byCategory = source.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount)
      return acc
    }, {})
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

    return {
      totalSpent: formatCurrency(totalSpent),
      transactionCount: source.length,
      dailyAverage: formatCurrency(Math.round(totalSpent / Math.max(source.length, 1))),
      topCategory: topCategory ? topCategory[0] : '—'
    }
  }, [items, visibleItems])

  const trendData = useMemo(() => {
    const groups = new Map<string, number>()
    items.forEach((item) => {
      const dateKey = new Date(item.transaction_date).toISOString().slice(0, 10)
      groups.set(dateKey, (groups.get(dateKey) ?? 0) + Number(item.amount))
    })

    const orderedDates = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
    return orderedDates.slice(-8).map(([date, value]) => ({
      name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      spent: value
    }))
  }, [items])

  const categoryBreakdown = useMemo(() => {
    const totals = items.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount)
      return acc
    }, {})

    const total = Object.values(totals).reduce((sum, value) => sum + value, 0)

    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], index) => ({
        name,
        value,
        percent: total ? Math.round((value / total) * 100) : 0,
        color: chartPalette[index % chartPalette.length]
      }))
  }, [items])

  const pieTotal = categoryBreakdown.reduce((sum, entry) => sum + entry.value, 0) || 1

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
      setFormError((current) => ({ ...current, description: message }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (record: ExpenseRecord) => {
    const confirmed = window.confirm(`Delete the expense "${record.description}"?`)
    if (!confirmed) {
      return
    }

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

  const recentTransactions = visibleItems.slice(0, 5)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080d1f] text-slate-100">
      <div className="pointer-events-none absolute right-[-5%] top-[-80px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,_rgba(168,85,247,0.9),_rgba(168,85,247,0.3)_28%,_transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute right-[8%] top-[70px] h-28 w-28 rounded-full border border-violet-200/60 bg-gradient-to-br from-violet-100/90 via-violet-200/50 to-transparent shadow-[0_0_90px_rgba(168,85,247,0.8)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[180px] h-40 bg-[radial-gradient(circle_at_50%_100%,rgba(72,187,120,0.12),transparent_55%)]" />

      <div className="relative mx-auto flex max-w-[1600px] flex-col xl:flex-row">
        <Sidebar />

        <main className="flex-1">
          <Topbar
            title="Dashboard"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onNewExpense={() => {
              setEditingId(null)
              setIsFormOpen(true)
              setFormError({})
            }}
          />

          <div className="space-y-6 p-4 sm:p-6 xl:p-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-emerald-300">Overview</p>
                <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Good morning, Arvinth!</h1>
                <p className="mt-2 text-base text-slate-300">Here’s your expense overview for this month.</p>
              </div>

              <div className="flex items-center gap-3 self-start xl:self-auto">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100"
                >
                  <CalendarRange className="h-4 w-4 text-emerald-300" />
                  This Month
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow"
                  onClick={() => {
                    setEditingId(null)
                    setIsFormOpen(true)
                    setFormError({})
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Expense
                </button>
              </div>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard title="Total Spent" value={summary.totalSpent} hint="12% vs last month" icon={<Banknote className="h-5 w-5" />} accent="green" />
              <SummaryCard title="Transactions" value={String(summary.transactionCount)} hint="8% vs last month" icon={<BarChart3 className="h-5 w-5" />} accent="violet" />
              <SummaryCard title="Daily Average" value={summary.dailyAverage} hint="6% vs last month" icon={<TrendingUp className="h-5 w-5" />} accent="orange" />
              <SummaryCard title="Top Category" value={summary.topCategory} hint={`${categoryBreakdown[0]?.percent ?? 0}% of total spending`} icon={<Wallet className="h-5 w-5" />} accent="purple" />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
              <div className="rounded-3xl border border-white/10 bg-[#0d142c]/90 p-5 shadow-soft">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-white">Spending Trend</h2>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
                    {['7D', '30D', '3M', '1M', 'Y'].map((option, index) => (
                      <button
                        key={option}
                        type="button"
                        className={[
                          'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                          index === 1 ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-white/5'
                        ].join(' ')}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                    <AreaChart data={trendData.length ? trendData : [{ name: 'No data', spent: 0 }]} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="spentFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.52} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.08} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spent']}
                        contentStyle={{ background: '#101b35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0' }}
                      />
                      <Area type="monotone" dataKey="spent" stroke="#34d399" strokeWidth={3} fill="url(#spentFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0d142c]/90 p-5 shadow-soft">
                <h2 className="text-2xl font-semibold text-white">Expense Breakdown</h2>

                <div className="mt-5 h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
                    <PieChart>
                      <Pie
                        data={categoryBreakdown.length ? categoryBreakdown : [{ name: 'No data', value: 1, color: '#10b981' }]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={78}
                        paddingAngle={3}
                        stroke="rgba(8,13,31,0.9)"
                        strokeWidth={2}
                      >
                        {(categoryBreakdown.length ? categoryBreakdown : [{ name: 'No data', value: 1, color: '#10b981' }]).map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spent']}
                        contentStyle={{ background: '#101b35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-3">
                  {categoryBreakdown.slice(0, 5).map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span>{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.6fr_420px]">
              <div className="rounded-3xl border border-white/10 bg-[#0d142c]/90 p-5 shadow-soft">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Recent Transactions</h2>
                    <p className="mt-1 text-sm text-slate-400">Latest expenses from your backend</p>
                  </div>
                  <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
                    View All <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {loading ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-400">Loading expenses…</div>
                ) : error ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                ) : recentTransactions.length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-separate border-spacing-0 text-left text-sm text-slate-300">
                      <thead>
                        <tr>
                          <th className="border-b border-white/10 px-3 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Date</th>
                          <th className="border-b border-white/10 px-3 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Description</th>
                          <th className="border-b border-white/10 px-3 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Category</th>
                          <th className="border-b border-white/10 px-3 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Amount</th>
                          <th className="border-b border-white/10 px-3 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((item) => (
                          <tr key={item.id} className="align-middle">
                            <td className="border-b border-white/10 px-3 py-4 text-slate-300">
                              {new Date(item.transaction_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="border-b border-white/10 px-3 py-4 font-medium text-white">{item.description}</td>
                            <td className="border-b border-white/10 px-3 py-4">
                              <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                                {item.category}
                              </span>
                            </td>
                            <td className="border-b border-white/10 px-3 py-4 font-semibold text-white">₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="border-b border-white/10 px-3 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  aria-label={`Edit ${item.description}`}
                                  onClick={() => beginEdit(item)}
                                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-emerald-500/30 hover:text-emerald-300"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Delete ${item.description}`}
                                  onClick={() => handleDelete(item)}
                                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/15"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-400">
                    No transactions yet. Create your first expense to start tracking spending.
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-[#0d142c]/90 p-5 shadow-soft">
                  <h3 className="text-2xl font-semibold text-white">Budget Progress</h3>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div className="text-4xl font-semibold text-white">₹24,500</div>
                    <div className="text-2xl font-semibold text-emerald-300">62%</div>
                  </div>
                  <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
                  </div>
                  <p className="mt-4 text-sm text-slate-300">You’re on track!</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0d142c]/90 p-5 shadow-soft">
                  <h3 className="text-2xl font-semibold text-white">Quick Actions</h3>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      { label: 'Add Expense', icon: Plus, tone: 'emerald' },
                      { label: 'View Reports', icon: BarChart3, tone: 'violet' },
                      { label: 'Set Goal', icon: Target, tone: 'amber' },
                      { label: 'Manage Categories', icon: ReceiptText, tone: 'blue' }
                    ].map(({ label, icon: Icon, tone }) => (
                      <button
                        key={label}
                        type="button"
                        className={[
                          'flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-3 text-center text-sm font-medium text-slate-100 transition hover:scale-[1.02]',
                          tone === 'emerald' && 'border-emerald-500/30 bg-emerald-500/10',
                          tone === 'violet' && 'border-violet-500/30 bg-violet-500/10',
                          tone === 'amber' && 'border-amber-500/30 bg-amber-500/10',
                          tone === 'blue' && 'border-sky-500/30 bg-sky-500/10'
                        ].join(' ')}
                      >
                        <Icon className="h-5 w-5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d142c] p-5 shadow-soft">
            <ExpenseForm
              mode={editingId !== null ? 'edit' : 'create'}
              initialValues={
                editingId !== null && items.find((item) => item.id === editingId)
                  ? {
                      amount: String(Number(items.find((item) => item.id === editingId)?.amount ?? 0)),
                      category: items.find((item) => item.id === editingId)?.category ?? 'Food',
                      description: items.find((item) => item.id === editingId)?.description ?? '',
                      transaction_date: items.find((item) => item.id === editingId)?.transaction_date ?? new Date().toISOString().slice(0, 10)
                    }
                  : undefined
              }
              submitLabel={editingId !== null ? 'Save changes' : 'Add expense'}
              submitting={submitting}
              errors={formError}
              onCancel={resetForm}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
