import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { AuthContext } from './context';
import { authService } from './authService';
import { createAuthSyncChannel, isAuthSyncMessage } from './authSync';
import { tokenStorage } from './token';
import { getApiError } from '../utils/apiErrorUtils';

import type { AuthSyncMessage } from './authSync';
import type { AuthUser, LoginCredentials } from './types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authChannelRef = useRef<BroadcastChannel | null>(null);

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.get();

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await authService.me();

      setUser(currentUser);
    } catch (error: unknown) {
      if (getApiError(error)?.status === 401) {
        tokenStorage.clear();
        authChannelRef.current?.postMessage({
          type: 'logout',
          token,
        } satisfies AuthSyncMessage);
      }

      setUser(null);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);

    tokenStorage.set(data.token, credentials.rememberMe);
    setUser(data.user);
    authChannelRef.current?.postMessage({
      type: 'token-response',
      token: data.token,
    } satisfies AuthSyncMessage);
  }, []);

  const logout = useCallback(async () => {
    const token = tokenStorage.get();

    try {
      await authService.logout();
    } finally {
      tokenStorage.clear();
      setUser(null);

      if (token) {
        authChannelRef.current?.postMessage({
          type: 'logout',
          token,
        } satisfies AuthSyncMessage);
      }
    }
  }, []);

  useEffect(() => {
    const authChannel = createAuthSyncChannel();
    let peerRequestResolver: (() => void) | null = null;
    let peerRequestTimeout: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;

    authChannelRef.current = authChannel;

    function finishPeerRequest() {
      const resolve = peerRequestResolver;

      if (peerRequestTimeout) {
        clearTimeout(peerRequestTimeout);
      }

      peerRequestResolver = null;
      peerRequestTimeout = null;
      resolve?.();
    }

    function requestPeerToken(): Promise<void> {
      if (!authChannel || tokenStorage.get()) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        peerRequestResolver = resolve;
        peerRequestTimeout = setTimeout(finishPeerRequest, 100);
        authChannel.postMessage({
          type: 'token-request',
        } satisfies AuthSyncMessage);
      });
    }

    if (authChannel) {
      authChannel.onmessage = (event: MessageEvent<unknown>) => {
        if (!isAuthSyncMessage(event.data)) {
          return;
        }

        if (event.data.type === 'token-request') {
          const token = tokenStorage.get();

          if (token) {
            authChannel.postMessage({
              type: 'token-response',
              token,
            } satisfies AuthSyncMessage);
          }

          return;
        }

        if (event.data.type === 'token-response') {
          if (tokenStorage.get()) {
            return;
          }

          const wasWaitingForPeer = peerRequestResolver !== null;

          tokenStorage.set(event.data.token, false);
          finishPeerRequest();

          if (!wasWaitingForPeer) {
            void refreshUser();
          }

          return;
        }

        if (tokenStorage.get() === event.data.token) {
          tokenStorage.clear();
          setUser(null);
        }
      };
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== 'access_token' || event.storageArea !== localStorage) {
        return;
      }

      if (event.newValue === null) {
        if (!tokenStorage.get()) {
          setUser(null);
        }

        return;
      }

      void refreshUser();
    }

    window.addEventListener('storage', handleStorage);

    const initializeAuth = async () => {
      try {
        await requestPeerToken();
        await refreshUser();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
      finishPeerRequest();
      window.removeEventListener('storage', handleStorage);
      authChannel?.close();

      if (authChannelRef.current === authChannel) {
        authChannelRef.current = null;
      }
    };
  }, [refreshUser]);

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
