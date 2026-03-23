import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { name, ROUTER_DEFAULT_PAGE } from '../constants'
import type { RouterQueryParamValueType } from '../lib/types'
import { initialState } from '../structure'

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setQueryParameters(
      state,
      action: PayloadAction<typeof initialState.filters>,
    ) {
      state.filters = action.payload
    },
    setQueryParameter(
      state,
      action: PayloadAction<{
        key: string
        value: RouterQueryParamValueType
      }>,
    ) {
      state.filters[action.payload.key] = action.payload.value
    },
    setIsRouterInitialized(state, action: PayloadAction<boolean>) {
      state.isRouterInitialized = action.payload
    },
    setPathNameFlags(state, action: PayloadAction<string | undefined>) {
      const pagesState = Object.keys(state.pages).reduce<
        Record<string, boolean>
      >((acc, key) => {
        acc[key] = false

        return acc
      }, {})
      const pathName = action.payload
        ? `/${action.payload}`
        : ROUTER_DEFAULT_PAGE

      state.pages = {
        ...pagesState,
        [pathName]: true,
      }
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
