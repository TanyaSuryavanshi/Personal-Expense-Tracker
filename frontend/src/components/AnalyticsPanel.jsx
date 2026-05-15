import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import { exportTransactionsAsCSV, exportTransactionsAsPDF } from '../services/export'

const palette = ['#2563eb', '#16a34a', '#e11d48', '#f59e0b', '#8b5cf6', '#14b8a6']

export default function AnalyticsPanel({ analytics }) {
  if (!analytics) {
    return (
      <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/80 dark:ring-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading analytics...</p>
      </section>
    )
  }

  const pieData = analytics.categories.map((item, index) => ({ name: item.category, value: item.total, fill: palette[index % palette.length] }))
  const lineData = analytics.monthly_trends.map(item => ({ month: item.month.slice(0, 7), type: item.type, total: item.total }))
  const recent = analytics.recent_transactions

  const totalPie = pieData.reduce((s, item) => s + (Number(item.value) || 0), 0)
  const noCategoryData = pieData.length === 0 || totalPie === 0

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/80 dark:ring-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Category breakdown</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportTransactionsAsCSV(recent)} className="rounded-full border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">Export CSV</button>
          <button onClick={() => exportTransactionsAsPDF(recent)} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">Export PDF</button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="h-72 rounded-3xl bg-slate-100 p-4 pt-8 dark:bg-slate-950">
          <div className="mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Category share</h3>
          </div>
          {noCategoryData ? (
            <div className="flex h-[calc(100%-2rem)] flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
              <p className="mb-3">No category data yet.</p>
              <p className="mb-4 text-sm">Add transactions to get started.</p>
              <div>
                <button
                  onClick={() => {
                    const form = document.querySelector('form')
                    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    else window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Add transactions
                </button>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* <div className="h-72 rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Monthly trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" name="Spending/Income" stroke="#2563EB" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </section>
  )
}
