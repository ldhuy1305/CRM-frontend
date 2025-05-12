/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from '@/services/api'
import { authService } from '@/services/repositories/auth'
import type { AuthUser, LoginPayload } from '@/types/auth/auth'
import { defineStore } from 'pinia'
import type { Router } from 'vue-router'
import { POSITION, useToast } from 'vue-toastification'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  error: string | null
  isInitialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null as AuthUser | null,
    isAuthenticated: false,
    error: null as string | null,
    isInitialized: false,
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
        toast.success('Đăng nhập thành công!', {
          icon: '✅',
          position: POSITION.BOTTOM_RIGHT,
        })
      } catch (error: any) {
        this.error = error.message || 'Đăng nhập thất bại'
        console.log(this.error)

        toast.error(this.error, {
          icon: '❌',
          position: POSITION.BOTTOM_RIGHT,
        })
      }
    },

    async initialize() {
      const token = localStorage.getItem('access')
      if (token) {
        try {
          await this.fetchUser()
        } catch (error) {
          localStorage.removeItem('access')
          this.isAuthenticated = false
          this.user = null
        }
      }
      this.isInitialized = true
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
          position: POSITION.BOTTOM_RIGHT,
        })
        this.isAuthenticated = false
        this.user = null
      }
    },

    async logout(router: Router) {
      this.user = null
      this.isAuthenticated = false
      // this.isInitialized = false
      localStorage.removeItem('access')
      router.push('/login')
    },
  },
})
