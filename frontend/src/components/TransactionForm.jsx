import { useEffect, useState } from 'react'
import { createTransaction, getApiErrorMessage, updateTransaction, fetchAnalytics } from '../services/api'

const initialState = {
  amount: '',
  category: '',
  type: 'expense',
  description: '',
  date: new Date().toISOString().slice(0, 10),
}

export default function TransactionForm({ transaction, setTransaction, onSaved }) {
  const [form, setForm] = useState(initialState)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (transaction) {
      setForm({
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        description: transaction.description,
        date: transaction.date,
      })
    }
  }, [transaction])

  const loadCategories = async () => {
    try {
      const res = await fetchAnalytics()
      const cats = res?.data?.categories || []
      setCategories(cats.map(c => c.category))
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => { loadCategories() }, [])

  const handleChange = (event) => {
    if (error) setError('')
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const amountValue = Number(form.amount)
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }

    const payload = {
      ...form,
      amount: amountValue,
      category: form.category.trim(),
      description: form.description?.trim() || '',
    }

    try {
      if (transaction) {
        await updateTransaction(transaction.id, payload)
      } else {
        await createTransaction(payload)
      }
      setForm(initialState)
      setTransaction(null)
      onSaved()
      await loadCategories()
    } catch (err) {
      console.error('Transaction save failed:', err?.response?.data || err.message)
      setError(getApiErrorMessage(err) || 'Unable to save transaction')
    }
  }

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/80 dark:ring-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{transaction ? 'Edit transaction' : 'Add a new transaction'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track income and expenses with rich details.</p>
        </div>
        {transaction && (
          <button onClick={() => setTransaction(null)} className="rounded-full border border-slate-300 px-4 py-2 text-sm dark:border-slate-600">
            Cancel edit
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Amount</span>
          <input name="amount" value={form.amount} onChange={handleChange} type="number" step="0.01" min="0" required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            type="text"
            list="category-list"
            autoComplete="off"
            required
          />
          <datalist id="category-list">
            {categories.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Type</span>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Date</span>
          <input name="date" value={form.date} onChange={handleChange} type="date" required />
        </label>
        <label className="sm:col-span-2 grid gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
        </label>
        {error && <p className="sm:col-span-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button type="submit" className="sm:col-span-2 rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
          {transaction ? 'Save changes' : 'Add transaction'}
        </button>
      </form>
    </section>
  )
}
