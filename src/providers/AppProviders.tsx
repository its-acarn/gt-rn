import { PropsWithChildren, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  QueryClient,
  focusManager,
  onlineManager
} from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { AppNavigationTheme } from '@/theme/navigation';
import { linking } from '@/navigation/linking';
import { AuthProvider } from './AuthProvider';
import { initializeDatabase } from '@/storage/database';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true
    },
    mutations: {
      retry: 0
    }
  }
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'gt-rn-query-cache',
  throttleTime: 1000
});

const OnlineStatusManager = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      onlineManager.setOnline(Boolean(state.isConnected));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onAppStateChange = (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return null;
};

const DatabaseInitializer = () => {
  useEffect(() => {
    void initializeDatabase().catch((error) => {
      console.error('Database initialization failed', error);
    });
  }, []);

  return null;
};

export const AppProviders = ({ children }: PropsWithChildren) => (
  <SafeAreaProvider>
    <OnlineStatusManager />
    <DatabaseInitializer />
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24, buster: 'v0' }}
    >
      <AuthProvider>
        <NavigationContainer linking={linking} theme={AppNavigationTheme}>
          {children}
        </NavigationContainer>
      </AuthProvider>
    </PersistQueryClientProvider>
  </SafeAreaProvider>
);
