import { useEffect, useState, useRef } from 'react';
import { cognitoSignOut, getCognitoUser, getEmailFromIdToken, type CognitoSession } from './cognito';
import { AuthContext, type AuthProviderProps } from './auth';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    isMountedRef.current = true;
    const cognitoUser = getCognitoUser();
    if (cognitoUser) {
      cognitoUser.getSession((err: Error | null, session: CognitoSession | null) => {
        if (!isMountedRef.current) return;
        
        if (err || !session || !session.isValid()) {
          setIsLoading(false);
        } else {
          const token = session.getIdToken().getJwtToken();
          const userEmail = getEmailFromIdToken(token);
          setIdToken(token);
          setEmail(userEmail);
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      });
    } else {
      // Use queueMicrotask to defer setState and avoid synchronous call in effect
      queueMicrotask(() => {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      });
    }

    return () => {
      isMountedRef.current = false;
    };
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
