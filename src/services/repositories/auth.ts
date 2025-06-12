import axios from '@/services/api.ts'

export interface User {
  is_send_code: false
  message: string
  refresh: string
  access: string
}

export interface Permission {
  id: number
  name: string
  content_type: ContentType
}
export interface ContentType {
  id: number
  app_label: string
  model: string
}
export interface LoginPayload {
  email: string
  password: string
}

export interface ChangePasswordPayload {
  old_password: string
  new_password: string
  confirm_password: string
}

export class AuthService {
  private resource: string

  constructor() {
    this.resource = import.meta.env.VITE_API_AUTH_LOGIN || '/auth/login/'
  }

  async login(payload: LoginPayload): Promise<User> {
    try {
      const response = await axios.post(this.resource, payload)
      const data = response.data as User

      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      return data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại'
      throw new Error(message)
    }
  }

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    try {
      const response = await axios.put('/auth/change_password/', {
        old_password: payload.old_password,
        new_password: payload.new_password,
        confirm_password: payload.confirm_password,
      })
      return response.data
    } catch (error: any) {
      console.error('Error changing password:', error)
      throw new Error(
        error.response?.data?.message || error.response?.data?.error || 'Failed to change password',
      )
    }
  }
}

export const authService = new AuthService()
