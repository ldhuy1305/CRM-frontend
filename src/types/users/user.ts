import type { Permission } from '@/services/repositories/auth.ts'

export interface UserInfo {
  id: number
  first_name: string
  last_name: string
  address: string
  phone: string
  permission: Array<Permission>[]
}

export interface UserOption {
  id: number
  first_name: string
  last_name: string
}
