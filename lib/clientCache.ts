interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class ClientCache {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    if (!this.isClient) return;

    const expiresAt = Date.now() + ttlSeconds * 1000;
    const entry: CacheEntry<T> = { data, expiresAt };
    
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    if (!this.isClient) return null;

    try {
      const item = localStorage.getItem(key);
      
      if (!item) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(item);

      if (Date.now() > entry.expiresAt) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  has(key: string): boolean {
    if (!this.isClient) return false;

    try {
      const item = localStorage.getItem(key);
      
      if (!item) {
        return false;
      }

      const entry: CacheEntry<any> = JSON.parse(item);

      if (Date.now() > entry.expiresAt) {
        this.delete(key);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  delete(key: string): void {
    if (!this.isClient) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to delete from localStorage:', error);
    }
  }

  clear(): void {
    if (!this.isClient) return;
    
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Singleton instance
export const clientCache = new ClientCache();
