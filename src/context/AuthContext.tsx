import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as authService from '@src/services/authService';
import { AuthUser, Credentials, Registration } from '@src/services/authService';
import { initDatabase } from '@src/services/database/database';

interface AuthContextValue {
  user: AuthUser | null;
  /** True while the database opens and the saved session is restored. */
  isRestoring: boolean;
  /** Set when the database could not be opened. */
  startupError: string | null;
  login: (credentials: Credentials) => Promise<void>;
  register: (registration: Registration) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [startupError, setStartupError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    initDatabase()
      .then(authService.restoreSession)
      .then(restoredUser => isMounted && setUser(restoredUser))
      .catch(error => {
        console.error('[Auth] startup failed', error);
        if (isMounted) {
          setStartupError('Could not open local storage.');
        }
      })
      .finally(() => isMounted && setIsRestoring(false));
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    setUser(await authService.login(credentials));
  }, []);

  const register = useCallback(async (registration: Registration) => {
    setUser(await authService.register(registration));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isRestoring, startupError, login, register, logout }),
    [user, isRestoring, startupError, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
};

/** The signed-in user. Only use inside screens that require a session. */
export const useCurrentUser = (): AuthUser => {
  const { user } = useAuth();
  if (!user) {
    throw new Error('useCurrentUser used without a signed-in user.');
  }
  return user;
};
