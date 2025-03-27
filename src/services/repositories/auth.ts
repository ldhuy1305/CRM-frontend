import axios from '@/services/api.ts';

export interface User {
  id: number;
  email: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export class AuthService {
  private resource: string;

  constructor() {
    this.resource = import.meta.env.VITE_API_AUTH_LOGIN || '/auth/login/';
  }

  async login(payload: LoginPayload): Promise<User> {
    try {
      const response = await axios.post(this.resource, payload);
      return response.data as User;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      throw new Error(message);
    }
  }
}

export const authService = new AuthService();
