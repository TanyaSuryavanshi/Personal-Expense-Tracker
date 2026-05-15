import { useState } from 'react'
import { createBudget, updateBudget, deleteBudget, getApiErrorMessage } from '../services/api'

export default function BudgetPanel({ budgets, analytics, onBudgetUpdated }) {
  const [form, setForm] = useState({ category: '', limit_amount: '' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const updateForm = (field, value) => {
    if (error) setError('')
    setForm({ ...form, [field]: value })
  }

  const handleSave = async (event) => {
    event.preventDefault()
    try {
      const values = { category: form.category, limit_amount: form.limit_amount }
      if (editId) {
        await updateBudget(editId, values)
        setEditId(null)
      } else {
        await createBudget(values)
      }
      setForm({ category: '', limit_amount: '' })
      setError('')
      onBudgetUpdated()
    } catch (err) {
      setError(getApiErrorMessage(err) || 'Unable to save budget')
    }
  }

  const handleEdit = (budget) => {
    setEditId(budget.id)
    setForm({ category: budget.category, limit_amount: budget.limit_amount })
  }

  const handleRemove = async (id) => {
    if (!window.confirm('Delete this budget?')) return
    try {
      await deleteBudget(id)
      setError('')
      onBudgetUpdated()
    } catch (err) {
      setError(getApiErrorMessage(err) || 'Unable to delete budget')
    }
  }

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/80 dark:ring-slate-700">
      <h2 className="text-xl font-semibold">Budget manager</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create budget plans and receive spending alerts.</p>
      <form onSubmit={handleSave} className="mt-6 grid gap-4">
        <input name="category" value={form.category} onChange={e => updateForm('category', e.target.value)} placeholder="Category" required />
        <input name="limit_amount" value={form.limit_amount} onChange={e => updateForm('limit_amount', e.target.value)} placeholder="Limit amount" type="number" step="0.01" min="0" required />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button type="submit" className="rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
          {editId ? 'Update budget' : 'Add budget'}
        </button>
      </form>
      <div className="mt-6 space-y-3">
        {budgets.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No budgets defined yet.</p>
        ) : (
          budgets.map(budget => {
            const expenseRecord = analytics?.expense_by_category?.find(item => item.category === budget.category)
            const spent = Number(expenseRecord?.total || 0)
            const limit = Number(budget.limit_amount)
            const exceeded = spent > limit
            return (
              <div key={budget.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{budget.category}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Limit: ${limit.toFixed(2)} | Spent: ${spent.toFixed(2)}</p>
                    {exceeded && <p className="mt-1 text-sm font-semibold text-rose-600 dark:text-rose-400">Spending exceeds this budget!</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(budget)} className="rounded-full border border-slate-300 px-3 py-1 text-sm dark:border-slate-700">Edit</button>
                    <button onClick={() => handleRemove(budget.id)} className="rounded-full bg-rose-600 px-3 py-1 text-sm text-white hover:bg-rose-700">Delete</button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
