import { useContainer } from './container'
export * from './constants'
export * from './hooks/useAuthActions'
export * from './store'

export const auth = {
  service: useContainer,
}
