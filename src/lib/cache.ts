/**
 * Fast Redis-like In-Memory & Persistent Caching Layer
 * Provides instant 0ms responses for recurring Supabase/Database requests.
 */

interface CacheItem<T> {
  data: T;
  expiresAt: number; // Unix timestamp in ms
}

class CacheManager {
  private memoryCache = new Map<string, CacheItem<any>>();

  /**
   * Get a cached value. Checks in-memory cache first, then localStorage.
   */
  get<T>(key: string): T | null {
    const now = Date.now();

    // 1. Check fast RAM memory cache
    const memItem = this.memoryCache.get(key);
    if (memItem) {
      if (memItem.expiresAt > now) {
        return memItem.data as T;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check localStorage (persistent across reloads)
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`algohub_cache_${key}`);
        if (raw) {
          const item: CacheItem<T> = JSON.parse(raw);
          if (item.expiresAt > now) {
            // Restore to memory cache for subsequent instant access
            this.memoryCache.set(key, item);
            return item.data;
          }
          localStorage.removeItem(`algohub_cache_${key}`);
        }
      } catch {
        // Ignore storage errors
      }
    }

    return null;
  }

  /**
   * Set a cached value with TTL in seconds (default: 5 minutes / 300s).
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    const item: CacheItem<T> = { data, expiresAt };

    // Set memory cache
    this.memoryCache.set(key, item);

    // Set localStorage for persistent client cache
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`algohub_cache_${key}`, JSON.stringify(item));
      } catch {
        // Storage might be full or private browsing mode
      }
    }
  }

  /**
   * Get value from cache or execute fetcher and cache the result.
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    if (data !== undefined && data !== null) {
      this.set(key, data, ttlSeconds);
    }
    return data;
  }

  /**
   * Invalidate / delete a cache key.
   */
  del(key: string): void {
    this.memoryCache.delete(key);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`algohub_cache_${key}`);
      } catch {}
    }
  }

  /**
   * Clear all cached keys.
   */
  clear(): void {
    this.memoryCache.clear();
    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith("algohub_cache_"))
          .forEach((k) => localStorage.removeItem(k));
      } catch {}
    }
  }
}

export const fastCache = new CacheManager();
