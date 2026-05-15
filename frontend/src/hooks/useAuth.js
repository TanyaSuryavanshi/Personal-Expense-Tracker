import { useState, useEffect } from 'react'

const STORAGE_KEY = 'expense_token'

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [token])

  const logout = () => setToken(null)
  return { token, setToken, logout }
}
