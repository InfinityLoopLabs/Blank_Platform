import Redis from 'ioredis';

import { RedisConnector } from './redis-connector.module';

export type RedisEntityRepositoryOptions<TEntity, TId = string> = {
  keyPrefix: string;
  getId: (entity: TEntity) => TId;
  serialize?: (entity: TEntity) => string;
  deserialize?: (raw: string) => TEntity;
};

export class RedisEntityRepository<TEntity, TId = string> {
  private readonly serialize: (entity: TEntity) => string;
  private readonly deserialize: (raw: string) => TEntity;

  constructor(
    private readonly database: RedisRepository,
    private readonly options: RedisEntityRepositoryOptions<TEntity, TId>,
  ) {
    this.serialize = options.serialize ?? ((entity: TEntity) => JSON.stringify(entity));
    this.deserialize = options.deserialize ?? ((raw: string) => JSON.parse(raw) as TEntity);
  }

  async findById(id: TId): Promise<TEntity | null> {
    const raw = await this.database.get(this.toKey(id));
    if (!raw) {
      return null;
    }
    return this.deserialize(raw);
  }

  async save(entity: TEntity, ttlSeconds?: number): Promise<void> {
    const id = this.options.getId(entity);
    await this.database.set(this.toKey(id), this.serialize(entity), ttlSeconds);
  }

  async deleteById(id: TId): Promise<boolean> {
    return (await this.database.del(this.toKey(id))) > 0;
  }

  async exists(id: TId): Promise<boolean> {
    return this.database.exists(this.toKey(id));
  }

  toKey(id: TId): string {
    return `${this.options.keyPrefix}:${String(id)}`;
  }
}

export class RedisRepository {
  constructor(private readonly connector: RedisConnector) {}

  get client(): Redis {
    return this.connector.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, value, 'EX', ttlSeconds);
      return;
    }
    await this.client.set(key, value);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async hset(key: string, values: Record<string, string>): Promise<number> {
    if (Object.keys(values).length === 0) {
      return 0;
    }
    return this.client.hset(key, values);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    if (values.length === 0) {
      return this.client.llen(key);
    }
    return this.client.lpush(key, ...values);
  }

  async rpop(key: string): Promise<string | null> {
    return this.client.rpop(key);
  }

  forEntity<TEntity, TId = string>(
    options: RedisEntityRepositoryOptions<TEntity, TId>,
  ): RedisEntityRepository<TEntity, TId> {
    return new RedisEntityRepository<TEntity, TId>(this, options);
  }
}
