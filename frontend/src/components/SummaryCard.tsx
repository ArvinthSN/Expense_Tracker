import type { ReactNode } from 'react'

interface SummaryCardProps {
  title: string
  value: string
  hint: string
  icon: ReactNode
  accent?: 'green' | 'violet' | 'orange' | 'purple'
}

const accentClasses: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  green: 'bg-emerald-500/20 text-emerald-300',
  violet: 'bg-violet-500/20 text-violet-300',
  orange: 'bg-amber-500/20 text-amber-300',
  purple: 'bg-purple-500/20 text-purple-300'
}

export function SummaryCard({ title, value, hint, icon, accent = 'green' }: SummaryCardProps) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#0f1830]/80 p-5 shadow-soft backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300">{title}</p>
          <p className="mt-3 text-[2rem] font-semibold leading-none text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClasses[accent]}`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">{hint}</p>
    </div>
  )
}
