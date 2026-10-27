import { Bell, Plus, Search } from 'lucide-react'

interface TopbarProps {
  title: string
  onNewExpense: () => void
}

export function Topbar({ title, onNewExpense }: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">Overview</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-950">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
          <Search className="h-4 w-4" />
          Search expenses
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600"
          onClick={onNewExpense}
        >
          <Plus className="h-4 w-4" />
          New expense
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
