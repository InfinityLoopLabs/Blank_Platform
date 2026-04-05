import { createAuthContainer } from './container'
export * from './constants'
export * from './hooks/useAuthActions'
export * from './store'
export { createAuthContainer }
export type { AuthApiHooks, AuthServiceConfig, AuthMappers } from './container'

export const auth = {
  service: createAuthContainer,
}
