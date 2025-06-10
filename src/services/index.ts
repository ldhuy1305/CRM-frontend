import { AuthService } from '@/services/repositories/auth.ts'
export * from '@/services/repositories/account.ts'
export * from '@/services/repositories/call.ts'
export * from '@/services/repositories/campaign.ts'
export * from '@/services/repositories/contact.ts'
export * from '@/services/repositories/deal.ts'
export * from '@/services/repositories/lead.ts'
export * from '@/services/repositories/meeting.ts'
export * from '@/services/repositories/permission.ts'
export * from '@/services/repositories/task.ts'
export * from '@/services/repositories/user.ts'

export type ServiceFactory = {
  auth: AuthService
}

export const initServices = (): ServiceFactory => {
  return {
    auth: new AuthService(),
  }
}

export default initServices
