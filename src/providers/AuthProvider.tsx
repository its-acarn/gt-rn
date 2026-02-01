import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import * as SecureStore from 'expo-secure-store';

import { api, setAuthToken } from '@/services/api';
import { UserProfile } from '@/types/domain';

const TOKEN_KEY = 'gt-rn-auth-token';
const PROFILE_KEY = 'gt-rn-auth-profile';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type SignInPayload = {
  email: string;
  password: string;
};

type RegisterPayload = SignInPayload & {
  displayName: string;
};

type AuthContextValue = {
  status: AuthStatus;
  user: UserProfile | null;
  token: string | null;
  signIn: (payload: SignInPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthState = {
  status: AuthStatus;
  user: UserProfile | null;
  token: string | null;
};

const initialState: AuthState = {
  status: 'loading',
  user: null,
  token: null
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [token, storedProfile] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(PROFILE_KEY)
        ]);

        if (token) {
          setAuthToken(token);
        }

        if (token && storedProfile) {
          const profile: UserProfile = JSON.parse(storedProfile);
          setState({ status: 'authenticated', user: profile, token });
        } else {
          setState({ status: 'unauthenticated', user: null, token: null });
        }
      } catch (error) {
        console.warn('Failed to hydrate auth state', error);
        setState({ status: 'unauthenticated', user: null, token: null });
      }
    };

    void bootstrap();
  }, []);

  const handleSignIn = useCallback(async (payload: SignInPayload) => {
    setState((prev) => ({ ...prev, status: 'loading' }));

    try {
      // Backend returns { token, expiresAt, message } - no user object
      const loginResponse = await api.post('/api/auth/login', payload);
      const { token } = loginResponse.data as { token: string };

      // Set token first so the /me request is authenticated
      setAuthToken(token);

      // Fetch user profile
      const userResponse = await api.get('/api/auth/me');
      const backendUser = userResponse.data as { id: string; email: string; name: string };

      // Map backend User to frontend UserProfile
      const user: UserProfile = {
        id: backendUser.id,
        email: backendUser.email,
        displayName: backendUser.name,
        role: 'User', // Backend doesn't return role in /me, default to User
        publicSlug: '' // Backend doesn't return publicSlug in /me
      };

      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, token),
        SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(user))
      ]);

      setState({ status: 'authenticated', user, token });
    } catch (error) {
      console.error('Sign-in failed', error);
      setState({ status: 'unauthenticated', user: null, token: null });
      throw error;
    }
  }, []);

  const handleRegister = useCallback(async (payload: RegisterPayload) => {
    setState((prev) => ({ ...prev, status: 'loading' }));

    try {
      // Backend endpoint is POST /api/user with { email, name, password }
      const registerPayload = {
        email: payload.email,
        name: payload.displayName, // Frontend uses displayName, backend uses name
        password: payload.password
      };

      // Create user - returns User object but no token
      await api.post('/api/user', registerPayload);

      // Now log in with the credentials
      await handleSignIn({ email: payload.email, password: payload.password });
    } catch (error) {
      console.error('Registration failed', error);
      setState({ status: 'unauthenticated', user: null, token: null });
      throw error;
    }
  }, [handleSignIn]);

  const handleSignOut = useCallback(async () => {
    setAuthToken(null);
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(PROFILE_KEY)
    ]);
    setState({ status: 'unauthenticated', user: null, token: null });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.token) {
      return;
    }

    try {
      // Backend endpoint is GET /api/auth/me
      const response = await api.get('/api/auth/me');
      const backendUser = response.data as { id: string; email: string; name: string };

      // Map backend User to frontend UserProfile
      const user: UserProfile = {
        id: backendUser.id,
        email: backendUser.email,
        displayName: backendUser.name,
        role: 'User', // Backend doesn't return role in /me, default to User
        publicSlug: '' // Backend doesn't return publicSlug in /me
      };

      await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(user));
      setState((prev) => ({ ...prev, user }));
    } catch (error) {
      console.error('Profile refresh failed', error);
    }
  }, [state.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      user: state.user,
      token: state.token,
      signIn: handleSignIn,
      register: handleRegister,
      signOut: handleSignOut,
      refreshProfile
    }),
    [handleSignIn, handleRegister, handleSignOut, refreshProfile, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
