import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { persistQueryClient, type PersistedClient, type Persister } from '@tanstack/react-query-persist-client';
import { cacheGet as getCachedData, cacheSet as setCachedData, cacheClearExpired as clearExpiredCache, CACHE_DURATION } from './localDb';

// Custom persister using IndexedDB
const createIndexedDBPersister = (): Persister => ({
  persistClient: async (client: PersistedClient) => {
    try {
      await setCachedData('queryClient', client, CACHE_DURATION.CHART);
    } catch (error) {
      console.error('Failed to persist query client:', error);
    }
  },
  restoreClient: async (): Promise<PersistedClient | undefined> => {
    try {
      const restored = await getCachedData<PersistedClient>('queryClient');
      return restored ?? undefined;
    } catch (error) {
      console.error('Failed to restore query client:', error);
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      await clearExpiredCache();
    } catch (error) {
      console.error('Failed to remove query client:', error);
    }
  }
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime)
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors
        const status = typeof error === 'object' && error && 'status' in error ? Number((error as Record<string, unknown>).status) : undefined;
        if (typeof status === 'number' && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query error:', error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  }),
});

// Setup persistence
export const setupQueryPersistence = () => {
  if (typeof window !== 'undefined') {
    const persister = createIndexedDBPersister();
    
    persistQueryClient({
      queryClient,
      persister,
      maxAge: CACHE_DURATION.CHART,
    });

    // Clear expired cache on startup
    clearExpiredCache();
  }
}; 