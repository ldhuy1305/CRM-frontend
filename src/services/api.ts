// src/services/api.ts
import type { AxiosInstance } from 'axios'
import axios from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get('/auth/me/)
  return response.data
}
export default api
