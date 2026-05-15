import { useEffect, useMemo, useState } from 'react'
import { fetchTransactions, fetchAnalytics, fetchBudgets, login, register } from './services/api'
import { useAuth } from './hooks/useAuth'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import TransactionForm from './components/TransactionForm'
import TransactionTable from './components/TransactionTable'
import AnalyticsPanel from './components/AnalyticsPanel'
import BudgetPanel from './components/BudgetPanel'

const AUTH_STATE = {
  login: 'login',
  signup: 'signup',
}

function App() {
  const { token, setToken, logout } = useAuth()
  const [authMode, setAuthMode] = useState(AUTH_STATE.login)
  const [transactions, setTransactions] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [filters, setFilters] = useState({ category: '', start_date: '', end_date: '' })
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const isAuthenticated = Boolean(token)

  const fetchData = async () => {
    try {
      const [transactionsRes, analyticsRes, budgetsRes] = await Promise.all([
        fetchTransactions(filters),
        fetchAnalytics(),
        fetchBudgets(),
      ])
      setTransactions(transactionsRes.data)
      setAnalytics(analyticsRes.data)
      setBudgets(budgetsRes.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, filters])

  const authSubmit = async (values) => {
    try {
      if (authMode === AUTH_STATE.login) {
        const response = await login(values)
        if (response?.data?.access) {
          setToken(response.data.access)
        }
      } else {
        await register(values)
        const loginResponse = await login({ username: values.username, password: values.password })
        if (loginResponse?.data?.access) {
          setToken(loginResponse.data.access)
        }
      }
    } catch (error) {
      console.error('Auth error', error)
      throw error
    }
  }

  const totalIncome = useMemo(() => analytics?.income || 0, [analytics])
  const totalExpenses = useMemo(() => analytics?.expenses || 0, [analytics])
  const savings = useMemo(() => analytics?.savings || 0, [analytics])

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/80 dark:ring-slate-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Personal Expense Tracker</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Track income, expenses, budgets and view spending analytics in one dashboard.</p>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <button onClick={logout} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {!isAuthenticated ? (
          <AuthForm authMode={authMode} setAuthMode={setAuthMode} onSubmit={authSubmit} />
        ) : (
          <main className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="space-y-6">
              <Dashboard income={totalIncome} expenses={totalExpenses} savings={savings} recent={analytics?.recent_transactions || []} />
              <TransactionForm onSaved={fetchData} transaction={selectedTransaction} setTransaction={setSelectedTransaction} />
              <TransactionTable
                transactions={transactions}
                filters={filters}
                setFilters={setFilters}
                onRefresh={fetchData}
                onEdit={setSelectedTransaction}
              />
            </section>
            <aside className="space-y-6">
              <AnalyticsPanel analytics={analytics} />
              <BudgetPanel budgets={budgets} analytics={analytics} onBudgetUpdated={fetchData} />
            </aside>
          </main>
        )}
      </div>
    </div>
  )
}

export default App
