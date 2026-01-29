import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

type SyncState = {
  lastSyncAt: string | null;
  isSyncing: boolean;
};

const initialState: SyncState = {
  lastSyncAt: null,
  isSyncing: false
};

export const useSync = () => {
  const [state, setState] = useState<SyncState>(initialState);
  const isMounted = useRef(true);

  const performSync = useCallback(async () => {
    setState((prev) => ({ ...prev, isSyncing: true }));

    try {
      // TODO: push pending visits/wishlist changes then pull deltas.
      // await pushLocalChanges();
      // const lastSyncAt = await pullServerDeltas();
      const timestamp = new Date().toISOString();
      setState({ isSyncing: false, lastSyncAt: timestamp });
    } catch (error) {
      console.error('Sync failed', error);
      if (isMounted.current) {
        setState((prev) => ({ ...prev, isSyncing: false }));
      }
    }
  }, []);

  useEffect(() => {
    const handleAppStateChange = (status: AppStateStatus) => {
      if (status === 'active') {
        void performSync();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [performSync]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        void performSync();
      }
    });

    return () => unsubscribe();
  }, [performSync]);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  return {
    isSyncing: state.isSyncing,
    lastSyncAt: state.lastSyncAt,
    triggerSync: performSync
  };
};
