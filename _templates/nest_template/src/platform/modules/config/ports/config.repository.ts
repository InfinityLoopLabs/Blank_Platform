export interface IConfigRepository {
  get(key: string): string | undefined
}

export const CONFIG_REPOSITORY = Symbol('CONFIG_REPOSITORY')
