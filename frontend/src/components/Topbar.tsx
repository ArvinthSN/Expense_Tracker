import { Bell, Plus, Search, Settings2, Sparkles } from 'lucide-react'

interface TopbarProps {
  title: string
  searchValue: string
  onSearchChange: (value: string) => void
  onNewExpense: () => void
}

export function Topbar({ title, searchValue, onSearchChange, onNewExpense }: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 bg-[#0b1329]/60 px-4 py-4 backdrop-blur-xl sm:px-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="w-full max-w-[620px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 shadow-soft backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              aria-label="Search transactions"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search transactions... (e.g. food, travel)"
              className="w-full bg-transparent text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none"
            />
            <span className="hidden rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300 md:inline-flex">
              Ctrl + K
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end xl:self-auto">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
        >
          <Settings2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          onClick={onNewExpense}
        >
          <Plus className="h-4 w-4" />
          {title === 'Dashboard' ? 'Add Expense' : 'New expense'}
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-sm font-semibold text-white shadow-soft">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>
    </header>
  )
}
