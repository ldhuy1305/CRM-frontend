export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
}

export interface AuthUser {
  user: User
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}
