export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  emailCode: string;
  captcha: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  role: string | null;
}

export interface AuthActions {
  login: (data: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  initialize: () => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
}
