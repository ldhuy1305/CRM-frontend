export interface User {
  id: number;
  email: string;
  token: string;
  first_name: string;
  last_name:string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
