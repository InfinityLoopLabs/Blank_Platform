export interface IConfigRepository {
  get(key: string): string | undefined
}
