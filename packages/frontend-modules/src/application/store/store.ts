import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type {
  AnyAction,
  EnhancedStore,
  Middleware,
  Reducer,
  SerializableStateInvariantMiddlewareOptions,
} from '@reduxjs/toolkit'

type SerializableOverridesType = Pick<
  SerializableStateInvariantMiddlewareOptions,
  'ignoredActions' | 'ignoredPaths'
>

type ReducerRegistryType = Record<string, Reducer<Record<string, unknown>, AnyAction>>

export type CreateReduxStoreOptionsType = {
  reducers: ReducerRegistryType
  middlewares?: Middleware[]
  isDevtoolsEnabled?: boolean
  serializableCheck?: SerializableOverridesType
  preloadedState?: Record<string, unknown>
}

export type CreateReduxStoreResultType = {
  store: EnhancedStore
  rootReducer: Reducer<Record<string, unknown>, AnyAction>
}

export const createReduxStore = ({
  reducers,
  middlewares = [],
  isDevtoolsEnabled,
  serializableCheck,
  preloadedState,
}: CreateReduxStoreOptionsType): CreateReduxStoreResultType => {
  const rootReducer = combineReducers(reducers) as Reducer<Record<string, unknown>, AnyAction>
  const isDevtoolsEnabledResolved =
    isDevtoolsEnabled ?? process.env.NODE_ENV !== 'production'

  const store = configureStore({
    reducer: rootReducer,
    devTools: isDevtoolsEnabledResolved,
    preloadedState,
    middleware: getDefaultMiddleware => {
      const base = getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: serializableCheck?.ignoredActions ?? [],
          ignoredPaths: serializableCheck?.ignoredPaths ?? [],
        },
      })

      return base.concat(middlewares)
    },
  })

  return {
    store,
    rootReducer,
  }
}
