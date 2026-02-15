import { ConfigRepository } from '../ports/config.repository';

export type ConfigSnapshot = Record<string, string>;

export class ServerConfigRepository implements ConfigRepository {
  constructor(private readonly snapshot: ConfigSnapshot) {}

  get(key: string): string | undefined {
    return this.snapshot[key];
  }
}
