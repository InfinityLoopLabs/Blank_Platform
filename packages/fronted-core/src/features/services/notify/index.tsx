import { useContainer } from './container'

export * from './constants'
export * from './hooks/useNotifyActions'
export * from './lib/types'
export * from './store'

export const notify = {
  service: useContainer,
}
