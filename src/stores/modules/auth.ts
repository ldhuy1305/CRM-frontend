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
  isInitializing: boolean // Add this flag
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null as AuthUser | null,
    isAuthenticated: false,
    error: null as string | null,
    isInitialized: false,
    isInitializing: false, // Add this flag
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
        localStorage.setItem('user', JSON.stringify(userData)) // Cache user data

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
      // Prevent multiple simultaneous initializations
      if (this.isInitialized || this.isInitializing) {
        return
      }

      this.isInitializing = true

      try {
        const token = localStorage.getItem('access')

        if (!token) {
          this.isAuthenticated = false
          this.user = null
          return
        }

        // Try to use cached user first
        const cachedUser = localStorage.getItem('user')
        if (cachedUser) {
          try {
            this.user = JSON.parse(cachedUser)
            this.isAuthenticated = true

            // Optionally refresh user data in background (without blocking)
            this.refreshUserInBackground()
          } catch (error) {
            console.error('Error parsing cached user:', error)
            localStorage.removeItem('user')
            await this.fetchUserData()
          }
        } else {
          // No cached user, fetch from API
          await this.fetchUserData()
        }
      } catch (error) {
        console.error('Error during initialization:', error)
        this.clearAuthData()
      } finally {
        this.isInitialized = true
        this.isInitializing = false
      }
    },

    async fetchUserData() {
      try {
        const userData = await getCurrentUser()
        this.user = userData
        this.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(userData))
      } catch (error) {
        console.error('Error fetching user data:', error)
        this.clearAuthData()
        throw error
      }
    },

    async refreshUserInBackground() {
      try {
        const userData = await getCurrentUser()
        this.user = userData
        localStorage.setItem('user', JSON.stringify(userData))
      } catch (error) {
        console.error('Error refreshing user in background:', error)
        // Don't throw error for background refresh
      }
    },

    async fetchUser() {
      const toast = useToast()
      try {
        this.error = null
        await this.fetchUserData()
      } catch (error: any) {
        this.error = error.message || 'Không thể lấy thông tin user'
        toast.error(this.error, {
          icon: '❌',
          position: POSITION.BOTTOM_RIGHT,
        })
      }
    },

    clearAuthData() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('access')
      localStorage.removeItem('user')
    },

    async logout(router: Router) {
      this.clearAuthData()
      this.isInitialized = false // Reset initialization state
      router.push('/login')
    },
  },
})
