import { ArrowRightLeft, CircleDollarSign, LayoutDashboard, ReceiptText } from 'lucide-react'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Expenses', icon: ReceiptText, active: false },
  { label: 'Transactions', icon: ArrowRightLeft, active: false }
]

export function Sidebar() {
  return (
    <aside className="w-full border-r border-slate-200 bg-white/80 p-4 backdrop-blur xl:w-72">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft">
          <CircleDollarSign className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-950">ExpenseFlow</p>
          <p className="text-sm text-slate-500">Finance overview</p>
        </div>
      </div>

      <nav className="mt-6 space-y-2" aria-label="Sidebar navigation">
        {items.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={[
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
              active
                ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ].join(' ')}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
