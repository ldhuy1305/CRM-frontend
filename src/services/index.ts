import { AuthService } from '@/services/repositories/auth'
export * from '@/services/repositories/contact'
export * from '@/services/repositories/lead'
export * from './repositories/industry'
export * from './repositories/user'

export type ServiceFactory = {
  auth: AuthService
}

export const initServices = (): ServiceFactory => {
  return {
    auth: new AuthService(),
  }
}

export default initServices
