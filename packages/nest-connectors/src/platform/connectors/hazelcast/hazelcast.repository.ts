import { IMap } from 'hazelcast-client';

import { HazelcastConnector } from './hazelcast-connector.module';

export type HazelcastEntityRepositoryOptions<TEntity, TId = string> = {
  mapName: string;
  getId: (entity: TEntity) => TId;
};

export class HazelcastEntityRepository<TEntity, TId = string> {
  constructor(
    private readonly database: HazelcastRepository,
    private readonly options: HazelcastEntityRepositoryOptions<TEntity, TId>,
  ) {}

  async findById(id: TId): Promise<TEntity | null> {
    return this.database.get<TId, TEntity>(this.options.mapName, id);
  }

  async save(entity: TEntity, ttlMs?: number): Promise<void> {
    const id = this.options.getId(entity);
    await this.database.set<TId, TEntity>(this.options.mapName, id, entity, ttlMs);
  }

  async deleteById(id: TId): Promise<boolean> {
    const removed = await this.database.delete<TId, TEntity>(this.options.mapName, id);
    return removed !== null;
  }

  async exists(id: TId): Promise<boolean> {
    return this.database.exists<TId>(this.options.mapName, id);
  }
}

export class HazelcastRepository {
  constructor(private readonly connector: HazelcastConnector) {}

  get client() {
    return this.connector.client;
  }

  async getMap<K, V>(mapName: string): Promise<IMap<K, V>> {
    return this.client.getMap<K, V>(mapName);
  }

  async get<K, V>(mapName: string, key: K): Promise<V | null> {
    const map = await this.getMap<K, V>(mapName);
    const value = await map.get(key);
    return value ?? null;
  }

  async set<K, V>(mapName: string, key: K, value: V, ttlMs?: number): Promise<void> {
    const map = await this.getMap<K, V>(mapName);
    if (ttlMs && ttlMs > 0) {
      await map.put(key, value, ttlMs);
      return;
    }
    await map.put(key, value);
  }

  async exists<K>(mapName: string, key: K): Promise<boolean> {
    const map = await this.getMap<K, unknown>(mapName);
    return map.containsKey(key);
  }

  async delete<K, V>(mapName: string, key: K): Promise<V | null> {
    const map = await this.getMap<K, V>(mapName);
    const removed = await map.remove(key);
    return typeof removed === 'boolean' ? null : (removed ?? null);
  }

  async clear(mapName: string): Promise<void> {
    const map = await this.getMap<unknown, unknown>(mapName);
    await map.clear();
  }

  forEntity<TEntity, TId = string>(
    options: HazelcastEntityRepositoryOptions<TEntity, TId>,
  ): HazelcastEntityRepository<TEntity, TId> {
    return new HazelcastEntityRepository<TEntity, TId>(this, options);
  }
}
