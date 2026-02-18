'use client'

import { useContainer } from './container'

export * from './constants'
export * from './hooks/useAppSizeActions'
export * from './lib/types'
export * from './store'

export const appSize = {
  service: useContainer,
}
