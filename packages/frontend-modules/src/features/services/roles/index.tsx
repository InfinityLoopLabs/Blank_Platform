import { useContainer } from './container'
export * from './constants'
export * from './hooks/useRolesActions'
export * from './store'
export * from './lib'

export const roles = {
  service: useContainer,
}
