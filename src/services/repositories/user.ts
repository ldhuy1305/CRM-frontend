import type { UserCreatePayload, UserInfo } from '@/types/users/user'
import api from '../api'
import { BaseRepository } from '../base'

class UserRepository extends BaseRepository<UserInfo, UserCreatePayload> {
  constructor() {
    super(api, 'users')
  }

  // Create password for invited user
  async createPassword(code: string, password: string): Promise<void> {
    try {
      const response = await this.$axios.post(`${this.resource}/password/?p=${code}`, {
        password: password,
      })
      return response.data
    } catch (error) {
      console.error('Error creating password:', error)
      throw error
    }
  }
}

export const userRepository = new UserRepository()
