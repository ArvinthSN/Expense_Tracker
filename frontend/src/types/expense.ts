export type ExpenseCategory =
  | 'Housing'
  | 'Food'
  | 'Transport'
  | 'Utilities'
  | 'Entertainment'
  | 'Shopping'
  | 'Health'
  | 'Travel'
  | 'Other'

export interface ExpenseRecord {
  id: number
  amount: string
  category: string
  description: string
  transaction_date: string
  created_at: string
  updated_at: string
}

export interface ExpensePayload {
  amount: string
  category: string
  description: string
  transaction_date: string
}

export interface ExpenseListResponse {
  page: number
  page_size: number
  total: number
  items: ExpenseRecord[]
}

export interface ApiErrorShape {
  error?: string
  message?: string
  detail?: string | { msg?: string; error?: string }
}
