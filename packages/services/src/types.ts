import type { createServicesStore } from './store/createServicesStore'

export type ServicesStoreType = ReturnType<typeof createServicesStore>
export type ServicesStateType<TStore extends { getState: () => unknown }> =
  ReturnType<TStore['getState']>
export type ServicesDispatchType<TStore extends { dispatch: unknown }> =
  TStore['dispatch']
