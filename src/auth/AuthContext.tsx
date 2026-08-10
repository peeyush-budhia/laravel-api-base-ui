import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './context';
import { authService } from './authService';
import { tokenStorage } from './token';
import type { AuthUser, LoginCredentials } from './types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.get();

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await authService.me();
      setUser(currentUser);
    } catch {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, [refreshUser]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);

    tokenStorage.set(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
