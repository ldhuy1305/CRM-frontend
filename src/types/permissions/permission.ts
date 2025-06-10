import type { UserInfo } from '../users/user'

export interface ContentType {
  id: number
  app_label: string
  model: string
}

export interface Permission {
  id: number
  name: string
  content_type: ContentType
}

// export interface GroupUser {
//   id: number
//   first_name: string
//   last_name: string
//   address: string | null
//   phone: string | null
//   avatar: string
// }

export interface Group {
  id: number
  name: string
  permissions: Permission[]
  users: UserInfo[]
}

export interface GroupPermissions {
  name: string
  permissions: Permission[]
}

export interface GroupCreateEditPayload {
  name: string
  users: number[]
  permissions: number[]
}
