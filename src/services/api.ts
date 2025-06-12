// src/services/api.ts
import { useAuthStore } from '@/stores/modules/auth'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh')
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`, {
      refresh: refresh,
    })
    const { access } = response.data
    localStorage.setItem('access', access)
    return access
  } catch (error) {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    window.location.href = '/login'
    return null
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const newToken = await refreshToken()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } else {
        // Clear user data when refresh fails
        const authStore = useAuthStore()
        authStore.clearAuthData()
      }
    }

    return Promise.reject(error)
  },
)

export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get('/auth/me/')
  return response.data
}

export default api
