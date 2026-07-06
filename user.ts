export interface User {
  id: string;
  username: string;
  email: string;
  theme: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  theme: string;
  gender: string;
}
