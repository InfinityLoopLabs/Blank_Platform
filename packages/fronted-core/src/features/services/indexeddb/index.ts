import { type IndexedDbConfigType, useContainer } from './container'

export * from './constants'
export * from './container'
export * from './hooks/useIndexeddbActions'
export * from './store'

export const indexeddb = {
  service:
    (indexedDbInstances: IndexedDbConfigType[] = []) =>
    () =>
      useContainer(indexedDbInstances),
}
