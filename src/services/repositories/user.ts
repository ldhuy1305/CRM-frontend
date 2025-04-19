import type { UserInfo } from '@/types/users/user'
import api from '../api'
import { BaseRepository } from '../base'

class UserRepository extends BaseRepository<UserInfo, UserInfo> {
  constructor() {
    super(api, 'users')
  }
}

export const userRepository = new UserRepository()
