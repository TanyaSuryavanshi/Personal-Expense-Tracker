import { useState } from 'react'
import { getApiErrorMessage } from '../services/api'

const fields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'Email', type: 'email', optional: true },
  { name: 'password', label: 'Password', type: 'password' },
]

export default function AuthForm({ authMode, setAuthMode, onSubmit }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await onSubmit(form)
    } catch (err) {
      setError(getApiErrorMessage(err) || 'Unable to authenticate.')
    }
  }

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/80 dark:ring-slate-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{authMode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{authMode === 'login' ? 'Login to manage your budget and transactions.' : 'Sign up to start tracking your personal finances.'}</p>
        </div>
        <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
          {authMode === 'login' ? 'Create account' : 'Sign in'}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        {fields.map(field => {
          if (field.name === 'email' && authMode === 'login') return null
          return (
            <div key={field.name} className="grid gap-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={field.name}>{field.label}</label>
              <input id={field.name} name={field.name} type={field.type} value={form[field.name]} onChange={handleChange} required={!field.optional} className="w-full" />
            </div>
          )
        })}
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button type="submit" className="rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
          {authMode === 'login' ? 'Login' : 'Sign up'}
        </button>
      </form>
    </section>
  )
}
