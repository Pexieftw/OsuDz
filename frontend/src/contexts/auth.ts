import { createContext } from 'react';

export interface User {
  id: number;
  username: string;
  avatar_url: string;
  country_code: string;
  cover_url: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);