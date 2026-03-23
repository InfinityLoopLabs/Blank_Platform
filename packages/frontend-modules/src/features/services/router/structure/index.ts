import { ROUTER_DEFAULT_PAGES } from '../constants'
import type { RouterQueryParamsType } from '../lib/types'

export const initialState = {
  filters: {} as RouterQueryParamsType,
  isRouterInitialized: false,
  pages: ROUTER_DEFAULT_PAGES.reduce<Record<string, boolean>>((acc, page) => {
    acc[page] = false

    return acc
  }, {}),
}
