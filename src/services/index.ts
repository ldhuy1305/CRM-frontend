import { AuthService } from '@/services/repositories/auth'
export * from '@/services/repositories/lead'

export type ServiceFactory = {
  auth: AuthService
}

export const initServices = (): ServiceFactory => {
  return {
    auth: new AuthService(),
  }
}

export default initServices
