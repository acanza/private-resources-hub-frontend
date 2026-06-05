import { createContext, type ReactNode } from 'react';

export type AuthContextType = {
  isAuthenticated: boolean;
  email: string | null;
  idToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export type AuthProviderProps = {
  children: ReactNode;
};
