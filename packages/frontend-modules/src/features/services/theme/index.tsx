'use client'

import { useContainer } from './container'

export * from './constants'
export * from './hooks/useThemeActions'
export * from './store'

export const theme = {
  service: useContainer,
}
