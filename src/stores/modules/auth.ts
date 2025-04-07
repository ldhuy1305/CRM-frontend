/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { authService } from '@/services/repositories/auth'
import type { LoginPayload, User } from '@/types/auth/auth'
import { useToast } from 'vue-toastification'
import type { Router } from 'vue-router'
import { getCurrentUser } from '@/services/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    error: null,
  }),

  actions: {
    async login(payload: LoginPayload, router: Router) {
      const toast = useToast()
      try {
        this.error = null
        const user = await authService.login(payload)
        localStorage.setItem('access', user.access)
        this.isAuthenticated = true

        const userData = await getCurrentUser()
        this.user = { ...userData }

        router.push('/')
        toast.success('Đăng nhập thành công!', { icon: '✅' })
      } catch (error: any) {
        this.error = error.message || 'Đăng nhập thất bại'
        console.log(this.error)

        toast.error(this.error, {
          icon: '❌',
        })
      }
    },

    async fetchUser() {
      const toast = useToast()
      try {
        this.error = null
        const userData = await getCurrentUser()
        this.user = userData
        this.isAuthenticated = true
      } catch (error: any) {
        this.error = error.message || 'Không thể lấy thông tin user'
        toast.error(this.error, {
          icon: '❌',
        })
        this.isAuthenticated = false
        this.user = null
      }
    },

    async logout(router: Router) {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      router.push('/login')
    },
  },
})
