import { Pencil, Trash2 } from 'lucide-react'

import type { ExpenseRecord } from '../types/expense'

interface TransactionsTableProps {
  items: ExpenseRecord[]
  onEdit: (item: ExpenseRecord) => void
  onDelete: (item: ExpenseRecord) => void
}

export function TransactionsTable({ items, onEdit, onDelete }: TransactionsTableProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
        No transactions yet. Create your first expense to start tracking spending.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{new Date(item.transaction_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{item.description}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                    {item.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-950">${Number(item.amount).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${item.description}`}
                      onClick={() => onEdit(item)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${item.description}`}
                      onClick={() => onDelete(item)}
                      className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
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
    </div>
  )
}
