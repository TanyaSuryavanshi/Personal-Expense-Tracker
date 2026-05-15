import { useEffect, useState } from 'react'
import { deleteTransaction, fetchAnalytics } from '../services/api'

export default function TransactionTable({ transactions, filters, setFilters, onRefresh, onEdit }) {
  const [categories, setCategories] = useState([])

  const loadCategories = async () => {
    try {
      const res = await fetchAnalytics()
      const cats = res?.data?.categories || []
      setCategories(cats.map(c => c.category))
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => { loadCategories() }, [transactions])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    await deleteTransaction(id)
    onRefresh()
  }

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/80 dark:ring-slate-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Transactions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Filter and manage your expense history.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <input
              name="category"
              value={filters.category}
              onChange={e => setFilters({ ...filters, category: e.target.value })}
              placeholder="Category"
              className="min-w-[12rem]"
              list="category-list-transactions"
              autoComplete="off"
            />
            <datalist id="category-list-transactions">
              {categories.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          <input name="start_date" value={filters.start_date} onChange={e => setFilters({ ...filters, start_date: e.target.value })} type="date" />
          <input name="end_date" value={filters.end_date} onChange={e => setFilters({ ...filters, end_date: e.target.value })} type="date" />
        </div>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
          <thead className="bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-950">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">No transactions found.</td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-4 py-3">{tx.date}</td>
                  <td className="px-4 py-3">{tx.category}</td>
                  <td className="px-4 py-3">{tx.type}</td>
                  <td className={`px-4 py-3 font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>${Number(tx.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{tx.description || '-'}</td>
                  <td className="px-4 py-3 space-x-2 flex">
                    <button onClick={() => onEdit(tx)} className="rounded-full border border-slate-300 px-3 py-1 text-sm dark:border-slate-700">Edit</button>
                    <button onClick={() => handleDelete(tx.id)} className="rounded-full bg-rose-600 px-3 py-1 text-sm text-white hover:bg-rose-700">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
