
import React, { createContext, useContext, useEffect, useState, useCallback, startTransition } from 'react';
import Cookies from 'js-cookie';

interface JWTUser {
  id: string;
  roles: string;
  userName: string;
  token: string;
  isConfirmed: boolean;
}

interface AuthContextType {
  user: JWTUser | null;
  token: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  setAuthData: (userData: JWTUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<JWTUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const checkExistingAuth = () => {
      try {
        const authToken = Cookies.get('auth_token');
        if (authToken) {
          setToken(authToken);
          // Decode JWT to get user info (basic decode without verification)
          try {
            const payload = JSON.parse(atob(authToken.split('.')[1]));
            const userData: JWTUser = {
              id: payload.nameid,
              roles: payload.role,
              userName: payload.unique_name,
              token: authToken,
              isConfirmed: true
            };
            setUser(userData);
            console.log('Restored auth from token:', userData.userName);
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            // Invalid token, remove it
            Cookies.remove('auth_token');
          }
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingAuth();
  }, []);

  const setAuthData = useCallback((userData: JWTUser) => {
    // Batch state updates to prevent multiple re-renders
    startTransition(() => {
      setUser(userData);
      setToken(userData.token);
    });
    Cookies.set('auth_token', userData.token, { expires: 7 });
    console.log('Auth data set:', userData.userName);
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Starting logout process...');
      Cookies.remove('auth_token');
      // Batch state updates to prevent multiple re-renders
      startTransition(() => {
        setUser(null);
        setToken(null);
      });
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state even if signOut fails
      startTransition(() => {
        setUser(null);
        setToken(null);
      });
      throw error;
    }
  }, []);

  const value = {
    user,
    token,
    isLoading,
    signOut,
    setAuthData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
