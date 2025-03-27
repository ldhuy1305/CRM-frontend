export interface User {
  id: number;
  email: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
