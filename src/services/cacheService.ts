import { Logger } from '../utils/logger';
import { config } from '../config/config';

interface CacheEntry {
  data: unknown;
  expiry: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheEntry>;
  private defaultTtl: number;

  private constructor() {
    this.cache = new Map();
    this.defaultTtl = config.cacheTtl * 1000; // Convert to ms
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      Logger.debug(`Cache MISS: ${key}`);
      return null;
    }

    if (Date.now() > entry.expiry) {
      Logger.debug(`Cache EXPIRED: ${key}`);
      this.cache.delete(key);
      return null;
    }

    Logger.debug(`Cache HIT: ${key}`);
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl ? ttl * 1000 : this.defaultTtl);
    this.cache.set(key, { data, expiry });
    Logger.debug(`Cache SET: ${key}`);
  }

  clear(): void {
    this.cache.clear();
    Logger.info('Cache CLEARED');
  }
}
