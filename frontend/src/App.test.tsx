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

  it('renders the SmartSpend dashboard shell and recent expenses', async () => {
    render(<App />)

    expect(await screen.findByText('SmartSpend')).toBeInTheDocument()
    expect(screen.getByText('Good morning, Arvinth!')).toBeInTheDocument()
    expect(screen.getByText('Total Spent')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /recent transactions/i })).toBeInTheDocument()
  })

  it('validates required expense fields before submitting', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addButtons = await screen.findAllByRole('button', { name: /^add expense$/i })
    await user.click(addButtons[0])

    const formSubmitButton = screen.getAllByRole('button', { name: /^add expense$/i }).at(-1)
    expect(formSubmitButton).toBeTruthy()

    await user.click(formSubmitButton!)
    expect(screen.getByText('Amount must be greater than zero.')).toBeInTheDocument()
  })
})
