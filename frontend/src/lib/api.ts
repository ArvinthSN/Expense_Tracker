import type { ApiErrorShape, ExpenseListResponse, ExpensePayload, ExpenseRecord } from '../types/expense'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  })

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    const detail = payload && typeof payload === 'object' ? payload : {}
    const errorShape: ApiErrorShape = detail as ApiErrorShape
    throw new Error(
      errorShape?.error ?? errorShape?.message ?? (typeof errorShape?.detail === 'string' ? errorShape.detail : 'Request failed'),
    )
  }

  return payload as T
}

export const expenseApi = {
  list: async (params?: Record<string, string | number | undefined>): Promise<ExpenseListResponse> => {
    const search = new URLSearchParams()

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        search.append(key, String(value))
      }
    })

    const query = search.toString()
    return request<ExpenseListResponse>(`/expenses${query ? `?${query}` : ''}`)
  },

  create: async (payload: ExpensePayload): Promise<ExpenseRecord> => request<ExpenseRecord>('/expenses', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  update: async (id: number, payload: ExpensePayload): Promise<ExpenseRecord> => request<ExpenseRecord>(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),

  delete: async (id: number): Promise<void> => {
    await request<void>(`/expenses/${id}`, { method: 'DELETE' })
  }
}
