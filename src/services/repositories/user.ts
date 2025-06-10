import type { UserCreatePayload, UserInfo } from '@/types/users/user'
import api from '../api'
import { BaseRepository } from '../base'

class UserRepository extends BaseRepository<UserInfo, UserCreatePayload> {
  constructor() {
    super(api, 'users')
  }
}

export const userRepository = new UserRepository()
