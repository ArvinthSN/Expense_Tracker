import {
  ArrowRightLeft,
  CircleDollarSign,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Target,
  TrendingUp,
  Wallet
} from 'lucide-react'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Expenses', icon: ReceiptText, active: false },
  { label: 'Categories', icon: Wallet, active: false },
  { label: 'Reports', icon: TrendingUp, active: false },
  { label: 'Goals', icon: Target, active: false },
  { label: 'Settings', icon: Settings, active: false }
]

export function Sidebar() {
  return (
    <aside className="w-full border-b border-white/10 bg-[#0B1329]/90 p-4 backdrop-blur-xl xl:w-[290px] xl:border-b-0 xl:border-r">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5 pl-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-glow">
          <CircleDollarSign className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-semibold leading-none text-white">SmartSpend</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Track • Analyz • Grow</p>
        </div>
      </div>

      <nav className="mt-6 space-y-2" aria-label="Sidebar navigation">
        {items.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={[
              'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-base font-medium transition-all',
              active
                ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            ].join(' ')}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 p-5 shadow-soft">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-500 text-lg shadow-glow">
          <span>🏆</span>
        </div>
        <h3 className="text-2xl font-semibold text-white">Reach your financial goals!</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">Set a monthly budget and stay on track.</p>
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          Set Goal
          <ArrowRightLeft className="h-4 w-4 rotate-90" />
        </button>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 via-pink-400 to-violet-500 text-sm font-semibold text-white">
          A
        </div>
        <div>
          <p className="font-semibold text-white">Arvinth S.N.</p>
          <p className="text-xs text-slate-400">Premium User</p>
        </div>
      </div>
    </aside>
  )
}
