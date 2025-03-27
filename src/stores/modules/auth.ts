import { defineStore } from 'pinia';
import { authService} from '@/services/repositories/auth.ts';
import { useRouter } from 'vue-router';
import type {LoginPayload, User }from '@/types/auth/auth.ts' ;
import { useToast } from 'vue-toastification';
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    error: null,
  }),

  actions: {
    async login(payload: LoginPayload) {
      const toast = useToast();
      const router = useRouter();
      try {
        this.error = null;
        const user = await authService.login(payload);
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('token', user.token);
        toast.success('Đăng nhập thành công!', {
          icon: '✅',
        });
        await router.push('/');
      } catch (error: any) {
        this.error = error.message || 'Đăng nhập thất bại';
        throw new Error(this.error);
      }
    },

    async logout() {
      const router = useRouter();
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      await router.push('/login');
    },
  },
});
