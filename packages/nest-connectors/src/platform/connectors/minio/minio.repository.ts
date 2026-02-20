import { BucketItemStat, Client as MinioClient } from 'minio';
import { Readable } from 'stream';

import { MinioConnector } from './minio-connector.module';

export type MinioObjectRepositoryOptions<TValue> = {
  bucketName: string;
  keyPrefix?: string;
  serialize?: (value: TValue) => Buffer | string;
  deserialize?: (value: Buffer) => TValue;
};

export class MinioObjectRepository<TValue> {
  private readonly serialize: (value: TValue) => Buffer | string;
  private readonly deserialize: (value: Buffer) => TValue;

  constructor(
    private readonly storage: MinioRepository,
    private readonly options: MinioObjectRepositoryOptions<TValue>,
  ) {
    this.serialize = options.serialize ?? ((value: TValue) => JSON.stringify(value));
    this.deserialize = options.deserialize ?? ((value: Buffer) => JSON.parse(value.toString('utf8')) as TValue);
  }

  async ensureBucket(region?: string): Promise<void> {
    await this.storage.ensureBucket(this.options.bucketName, region);
  }

  async put(id: string, value: TValue, metaData?: Record<string, string>): Promise<void> {
    await this.storage.putObject(this.options.bucketName, this.toObjectName(id), this.serialize(value), metaData);
  }

  async get(id: string): Promise<TValue | null> {
    try {
      const buffer = await this.storage.getObjectBuffer(this.options.bucketName, this.toObjectName(id));
      return this.deserialize(buffer);
    } catch (error) {
      if (isMissingObjectError(error)) {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.storage.removeObject(this.options.bucketName, this.toObjectName(id));
  }

  async exists(id: string): Promise<boolean> {
    try {
      await this.storage.statObject(this.options.bucketName, this.toObjectName(id));
      return true;
    } catch (error) {
      if (isMissingObjectError(error)) {
        return false;
      }
      throw error;
    }
  }

  private toObjectName(id: string): string {
    if (!this.options.keyPrefix) {
      return id;
    }
    return `${this.options.keyPrefix}/${id}`;
  }
}

export class MinioRepository {
  constructor(private readonly connector: MinioConnector) {}

  get client(): MinioClient {
    return this.connector.client;
  }

  async ensureBucket(bucketName: string, region?: string): Promise<void> {
    const exists = await this.client.bucketExists(bucketName);
    if (!exists) {
      await this.client.makeBucket(bucketName, region);
    }
  }

  async listBuckets(): Promise<string[]> {
    const buckets = await this.client.listBuckets();
    return buckets.map((bucket) => bucket.name);
  }

  async putObject(
    bucketName: string,
    objectName: string,
    data: Buffer | string,
    metaData?: Record<string, string>,
  ): Promise<Awaited<ReturnType<MinioClient['putObject']>>> {
    const size = typeof data === 'string' ? Buffer.byteLength(data) : data.byteLength;
    return this.client.putObject(bucketName, objectName, data, size, metaData);
  }

  async getObjectBuffer(bucketName: string, objectName: string): Promise<Buffer> {
    const stream = await this.client.getObject(bucketName, objectName);
    return MinioRepository.toBuffer(stream);
  }

  async statObject(bucketName: string, objectName: string): Promise<BucketItemStat> {
    return this.client.statObject(bucketName, objectName);
  }

  async removeObject(bucketName: string, objectName: string): Promise<void> {
    await this.client.removeObject(bucketName, objectName);
  }

  async presignedGetObject(bucketName: string, objectName: string, expirySeconds = 60): Promise<string> {
    return this.client.presignedGetObject(bucketName, objectName, expirySeconds);
  }

  forObject<TValue>(options: MinioObjectRepositoryOptions<TValue>): MinioObjectRepository<TValue> {
    return new MinioObjectRepository<TValue>(this, options);
  }

  private static async toBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      } else if (typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk));
      } else {
        chunks.push(Buffer.from(chunk));
      }
    }
    return Buffer.concat(chunks);
  }
}

function isMissingObjectError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const errorRecord = error as { code?: string };
  return errorRecord.code === 'NoSuchKey' || errorRecord.code === 'NotFound';
}
