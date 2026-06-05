import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { cognitoSignOut, getCognitoUser } from './cognito';

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

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const cognitoUser = getCognitoUser();
    if (cognitoUser) {
      cognitoUser.getSession((err: Error | null, session: any) => {
        if (err) {
          setIsLoading(false);
        } else if (session && session.isValid()) {
          const token = session.getIdToken().getJwtToken();
          const userEmail =
            cognitoUser.getUsername();
          setIdToken(token);
          setEmail(userEmail);
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { cognitoLogin } = await import('./cognito');
      const result = await cognitoLogin(email, password);
      setIdToken(result.idToken);
      setEmail(result.email);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    cognitoSignOut();
    setIsAuthenticated(false);
    setEmail(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        email,
        idToken,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
