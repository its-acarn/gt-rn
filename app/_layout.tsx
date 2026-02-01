import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  QueryClient,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { AppState, AppStateStatus } from 'react-native';

import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { initializeDatabase } from '@/services/storage';
import { CenteredSpinner } from '@/components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'gt-rn-query-cache',
  throttleTime: 1000,
});

function OnlineStatusManager() {
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
}

function DatabaseInitializer() {
  useEffect(() => {
    void initializeDatabase().catch((error) => {
      console.error('Database initialization failed', error);
    });
  }, []);

  return null;
}

function NavigationHandler() {
  const segments = useSegments();
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === 'loading') return;

    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = status === 'authenticated';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [status, segments]);

  if (status === 'loading') {
    return <CenteredSpinner message="Loading your data..." />;
  }

  return <Slot />;
}

function RootLayoutContent() {
  return (
    <>
      <StatusBar style="auto" />
      <OnlineStatusManager />
      <DatabaseInitializer />
      <NavigationHandler />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24, buster: 'v0' }}
      >
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
