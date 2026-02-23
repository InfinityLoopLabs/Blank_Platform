import { QdrantClient } from '@qdrant/js-client-rest';

import { QdrantConnector } from './qdrant-connector.module';

export type QdrantPoint = {
  id: string | number;
  vector: number[] | Record<string, number[]>;
  payload?: Record<string, unknown>;
};

export class QdrantRepository {
  constructor(private readonly connector: QdrantConnector) {}

  get client(): QdrantClient {
    return this.connector.client;
  }

  async collectionExists(collectionName: string): Promise<boolean> {
    const result = await this.client.collectionExists(collectionName);
    return Boolean((result as { exists?: boolean }).exists);
  }

  async createCollection(
    collectionName: string,
    vectors: Record<string, unknown>,
    onDiskPayload?: boolean,
  ): Promise<void> {
    await this.client.createCollection(collectionName, {
      vectors: vectors as never,
      on_disk_payload: onDiskPayload,
    });
  }

  async upsert(collectionName: string, points: QdrantPoint[]): Promise<void> {
    await this.client.upsert(collectionName, {
      wait: true,
      points,
    });
  }

  async search<TPayload extends Record<string, unknown> = Record<string, unknown>>(
    collectionName: string,
    vector: number[],
    limit = 10,
    filter?: Record<string, unknown>,
  ): Promise<Array<{ id: string | number; score: number; payload?: TPayload }>> {
    const result = await this.client.search(collectionName, {
      vector: vector as never,
      limit,
      filter,
      with_payload: true,
    });

    return result.map((item) => ({
      id: item.id as string | number,
      score: Number(item.score),
      payload: item.payload as TPayload | undefined,
    }));
  }

  async deletePoints(
    collectionName: string,
    points: Array<string | number>,
  ): Promise<void> {
    await this.client.delete(collectionName, {
      wait: true,
      points,
    });
  }
}
