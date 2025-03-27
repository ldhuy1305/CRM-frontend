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
      try {
        this.error = null;
        const user = await authService.login(payload);
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('token', user.token);
      } catch (error: any) {
        this.error = error.message || 'Đăng nhập thất bại';
        toast.error(this.error, {
          icon: '✅',
        });
      }
    },

    async logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});
