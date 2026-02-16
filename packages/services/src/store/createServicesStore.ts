import { configureStore, type ConfigureStoreOptions } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

export type CreateServicesStoreOptionsType = ConfigureStoreOptions & {
  shouldEnableListeners?: boolean
}

export const createServicesStore = (
  options: CreateServicesStoreOptionsType,
) => {
  const { shouldEnableListeners = true, ...configureStoreOptions } = options
  const store = configureStore(configureStoreOptions)

  if (shouldEnableListeners) {
    setupListeners(store.dispatch)
  }

  return store
}
