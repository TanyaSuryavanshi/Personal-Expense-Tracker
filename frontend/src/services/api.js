import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
})

export const getApiErrorMessage = error => {
  const data = error.response?.data
  if (!data) return error.message || 'Request failed'
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (data.non_field_errors) return data.non_field_errors.join(' ')

  const fieldErrors = Object.entries(data)
    .map(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(' ') : String(messages)
      return `${field}: ${text}`
    })
    .join(' ')

  return fieldErrors || 'Request failed'
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('expense_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = payload => api.post('/auth/register/', payload)
export const login = payload => api.post('/auth/login/', payload)
export const refreshToken = payload => api.post('/auth/refresh/', payload)
export const fetchTransactions = params => api.get('/transactions/', { params })
export const createTransaction = payload => api.post('/transactions/', payload)
export const updateTransaction = (id, payload) => api.put(`/transactions/${id}/`, payload)
export const deleteTransaction = id => api.delete(`/transactions/${id}/`)
export const fetchAnalytics = () => api.get('/analytics/')
export const fetchBudgets = () => api.get('/budget/')
export const createBudget = payload => api.post('/budget/', payload)
export const updateBudget = (id, payload) => api.put(`/budget/${id}/`, payload)
export const deleteBudget = id => api.delete(`/budget/${id}/`)
export const exportCSV = () => api.get('/export/csv/', { responseType: 'blob' })
export default api
