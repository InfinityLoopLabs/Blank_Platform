import { Observable, Subscription } from 'rxjs';

import { KafkaConnector } from './kafka-connector.module';

export type KafkaTopicRepositoryOptions = {
  topic: string;
  timeoutMs?: number;
};

export class KafkaTopicRepository<TPayload = unknown, TResponse = unknown> {
  constructor(
    private readonly bus: KafkaRepository,
    private readonly options: KafkaTopicRepositoryOptions,
  ) {}

  async emit(payload: TPayload, timeoutMs?: number): Promise<void> {
    await this.bus.emit(this.options.topic, payload, timeoutMs ?? this.options.timeoutMs);
  }

  async request(payload: TPayload, timeoutMs?: number): Promise<TResponse> {
    return this.bus.request<TResponse, TPayload>(this.options.topic, payload, timeoutMs ?? this.options.timeoutMs);
  }
}

export class KafkaRepository {
  private isConnected = false;

  constructor(private readonly connector: KafkaConnector) {}

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }
    await this.connector.client.connect();
    this.isConnected = true;
  }

  async emit(pattern: string, payload: unknown, timeoutMs = 10_000): Promise<void> {
    await this.connect();
    await this.waitForCompletion(this.connector.client.emit(pattern, payload), timeoutMs);
  }

  async request<TResponse = unknown, TPayload = unknown>(
    pattern: string,
    payload: TPayload,
    timeoutMs = 10_000,
  ): Promise<TResponse> {
    await this.connect();
    return this.waitForFirst<TResponse>(this.connector.client.send<TResponse, TPayload>(pattern, payload), timeoutMs);
  }

  async close(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    this.connector.client.close();
    this.isConnected = false;
  }

  forTopic<TPayload = unknown, TResponse = unknown>(
    options: KafkaTopicRepositoryOptions,
  ): KafkaTopicRepository<TPayload, TResponse> {
    return new KafkaTopicRepository<TPayload, TResponse>(this, options);
  }

  private waitForCompletion(source$: Observable<unknown>, timeoutMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let isSettled = false;
      let subscription: Subscription | undefined;

      const timer = setTimeout(() => {
        if (isSettled) {
          return;
        }
        isSettled = true;
        subscription?.unsubscribe();
        reject(new Error(`Kafka emit timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      subscription = source$.subscribe({
        next: () => {
          if (isSettled) {
            return;
          }
          isSettled = true;
          clearTimeout(timer);
          subscription?.unsubscribe();
          resolve();
        },
        complete: () => {
          if (isSettled) {
            return;
          }
          isSettled = true;
          clearTimeout(timer);
          resolve();
        },
        error: (error: unknown) => {
          if (isSettled) {
            return;
          }
          isSettled = true;
          clearTimeout(timer);
          reject(error);
        },
      });
    });
  }

  private waitForFirst<T>(source$: Observable<T>, timeoutMs: number): Promise<T> {
    return new Promise((resolve, reject) => {
      let isSettled = false;
      let subscription: Subscription | undefined;

      const timer = setTimeout(() => {
        if (isSettled) {
          return;
        }
        isSettled = true;
        subscription?.unsubscribe();
        reject(new Error(`Kafka request timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      subscription = source$.subscribe({
        next: (value) => {
          if (isSettled) {
            return;
          }
          isSettled = true;
          clearTimeout(timer);
          subscription?.unsubscribe();
          resolve(value);
        },
        complete: () => {
          if (isSettled) {
            return;
          }
          isSettled = true;
          clearTimeout(timer);
          reject(new Error('Kafka request completed without response payload'));
        },
        error: (error: unknown) => {
          if (isSettled) {
            return;
          }
          isSettled = true;
          clearTimeout(timer);
          reject(error);
        },
      });
    });
  }
}
