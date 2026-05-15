export default function Dashboard({ income, expenses, savings, recent }) {
  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/80 dark:ring-slate-700">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-950">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Income</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600 dark:text-emerald-400">${income.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-950">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Expenses</p>
          <p className="mt-2 text-3xl font-semibold text-rose-600 dark:text-rose-400">${expenses.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-950">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Savings</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">${savings.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recent transactions</h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">Latest 8</span>
        </div>
        <div className="mt-4 space-y-3">
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No transactions recorded yet.</p>
          ) : (
            recent.map(tx => (
              <div key={tx.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{tx.category}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tx.date} • {tx.type}</p>
                  </div>
                  <p className={`text-lg font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    ${Number(tx.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
