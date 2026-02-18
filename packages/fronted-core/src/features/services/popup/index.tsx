import { useContainer } from './container'

export * from './constants'
export * from './hooks/usePopupActions'
export * from './lib/types'
export * from './store'

export const popup = {
  service: useContainer,
}
