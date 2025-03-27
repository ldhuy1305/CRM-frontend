import { AuthService } from '@/services/repositories/auth';

export type ServiceFactory = {
  auth: AuthService;
};

export const initServices = (): ServiceFactory => {
  return {
    auth: new AuthService(),
  };
};

export default initServices;
