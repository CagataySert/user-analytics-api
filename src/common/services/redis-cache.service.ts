import { Injectable, Logger } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly redisClient;

  constructor() {
    this.redisClient = createClient({
      url: 'redis://localhost:6379'
    });

    this.redisClient.connect().catch(err => {
      this.logger.error('Redis connection error:', err);
    });

    this.redisClient.on('error', (err) => {
      this.logger.error('Redis error:', err);
    });

    this.redisClient.on('connect', () => {
      this.logger.log('Connected to Redis');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.redisClient.set(key, stringValue, { EX: ttl });
      } else {
        await this.redisClient.set(key, stringValue);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redisClient.keys(pattern);
    } catch (error) {
      this.logger.error(`Error getting keys with pattern ${pattern}:`, error);
      return [];
    }
  }
} 