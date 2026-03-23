import { useContainer } from './container'
export * from './constants'
export * from './hooks/useAnalyticsEngineActions'
export * from './store'
export * from './lib'

export const analyticsEngine = {
  service: useContainer,
}
