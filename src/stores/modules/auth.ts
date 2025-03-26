import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        const response = await axios.post('https://api.example.com/login', {
          username,
          password,
        });
        this.user = response.data;
        this.isAuthenticated = true;
        localStorage.setItem('token', response.data.token); // Lưu token
      } catch (error) {
        console.error('Đăng nhập thất bại:', error);
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});
