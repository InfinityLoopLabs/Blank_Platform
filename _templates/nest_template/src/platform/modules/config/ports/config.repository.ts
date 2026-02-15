export interface ConfigRepository {
  get(key: string): string | undefined;
}
