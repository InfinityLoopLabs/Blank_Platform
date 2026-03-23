'use client'

import { useContainer } from './container'

export * from './constants'
export * from './hooks/useRouterActions'
export * from './lib/types'
export * from './store'

export const router = {
  service: useContainer,
}
