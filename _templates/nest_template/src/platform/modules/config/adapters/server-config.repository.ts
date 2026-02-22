import { IConfigRepository } from '../ports/config.repository'

export type ConfigSnapshotType = Record<string, string>

export class ServerConfigRepository implements IConfigRepository {
  constructor(private readonly snapshot: ConfigSnapshotType) {}

  get(key: string): string | undefined {
    return this.snapshot[key]
  }
}
