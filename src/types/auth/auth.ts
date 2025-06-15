import type { NamedObject } from '../common/common_types'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  address: string
  phone: string
  avatar: string
  groups: NamedObject[]
}

export interface AuthUser {
  user: User
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}
