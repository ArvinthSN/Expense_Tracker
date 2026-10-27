import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Expense dashboard', () => {
  beforeEach(() => {
    global.fetch = vi.fn((url: string | URL, init?: RequestInit) => {
      const target = String(url)

      if (target.includes('/expenses') && (!init || init.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({
            page: 1,
            page_size: 10,
            total: 1,
            items: [
              {
                id: 1,
                amount: '24.50',
                category: 'Food',
                description: 'Groceries',
                transaction_date: '2026-10-15',
                created_at: '2026-10-15T10:00:00Z',
                updated_at: '2026-10-15T10:00:00Z'
              }
            ]
          })
        } as Response)
      }

      if (target.includes('/expenses') && init?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({
            id: 2,
            amount: '15.99',
            category: 'Food',
            description: 'Coffee',
            transaction_date: '2026-10-16',
            created_at: '2026-10-16T10:00:00Z',
            updated_at: '2026-10-16T10:00:00Z'
          })
        } as Response)
      }

      return Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({})
      } as Response)
    }) as typeof fetch
  })

  it('renders dashboard summary and recent expenses', async () => {
    render(<App />)

    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByText('Total Spent')).toBeInTheDocument()
    expect(screen.getByText('Recent transactions')).toBeInTheDocument()
  })

  it('validates required expense fields before submitting', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addButton = await screen.findByRole('button', { name: 'New expense' })
    await user.click(addButton)
    await user.click(screen.getByRole('button', { name: 'Add expense' }))

    expect(screen.getByText('Amount must be greater than zero.')).toBeInTheDocument()
  })
})
