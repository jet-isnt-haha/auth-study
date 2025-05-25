export interface User {
  id: string;
  email: string;
  role: string[];
}

export interface UserInfo extends User {
  id: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  roles: string[];
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  initialize: () => Promise<void>;
}
