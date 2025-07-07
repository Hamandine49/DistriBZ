import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VendingMachine } from '@/types/vendingMachine';

interface NetworkContextProps {
  isConnected: boolean;
  isOfflineMode: boolean;
  cachedMachines: VendingMachine[];
  cacheVendingMachines: (machines: VendingMachine[]) => Promise<void>;
  getCachedMachines: () => Promise<VendingMachine[]>;
  clearCache: () => Promise<void>;
  lastSyncTime: Date | null;
}

const NetworkContext = createContext<NetworkContextProps>({
  isConnected: true,
  isOfflineMode: false,
  cachedMachines: [],
  cacheVendingMachines: async () => {},
  getCachedMachines: async () => [],
  clearCache: async () => {},
  lastSyncTime: null,
});

const CACHE_KEYS = {
  VENDING_MACHINES: 'cached_vending_machines',
  LAST_SYNC: 'last_sync_time',
  USER_LOCATION: 'cached_user_location',
  FAVORITES: 'cached_favorites',
};

export const NetworkProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [cachedMachines, setCachedMachines] = useState<VendingMachine[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    // Load cached data on app start
    loadCachedData();

    return () => {
      unsubscribe();
    };
  }, []);

  const loadCachedData = async () => {
    try {
      // Load cached vending machines
      const cachedMachinesData = await AsyncStorage.getItem(CACHE_KEYS.VENDING_MACHINES);
      if (cachedMachinesData) {
        const machines = JSON.parse(cachedMachinesData);
        setCachedMachines(machines);
      }

      // Load last sync time
      const lastSync = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);
      if (lastSync) {
        setLastSyncTime(new Date(lastSync));
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const cacheVendingMachines = async (machines: VendingMachine[]) => {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.VENDING_MACHINES, JSON.stringify(machines));
      await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
      
      setCachedMachines(machines);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error caching vending machines:', error);
    }
  };

  const getCachedMachines = async (): Promise<VendingMachine[]> => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.VENDING_MACHINES);
      return cachedData ? JSON.parse(cachedData) : [];
    } catch (error) {
      console.error('Error getting cached machines:', error);
      return [];
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.VENDING_MACHINES,
        CACHE_KEYS.LAST_SYNC,
        CACHE_KEYS.USER_LOCATION,
        CACHE_KEYS.FAVORITES,
      ]);
      
      setCachedMachines([]);
      setLastSyncTime(null);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const isOfflineMode = !isConnected && cachedMachines.length > 0;

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isOfflineMode,
        cachedMachines,
        cacheVendingMachines,
        getCachedMachines,
        clearCache,
        lastSyncTime,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);