export interface UserInfo {
  id: number
  first_name: string
  last_name: string
  address: string
  phone: string
  // permission: Array<Permission>[]
  avatar: string
}

export interface UserOption {
  id: number
  first_name: string
  last_name: string
}

export interface UserCreatePayload {
  email: string
  first_name: string
  last_name: string
  group_permission: number
}
