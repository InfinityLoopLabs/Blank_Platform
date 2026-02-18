import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { name } from '../constants/name'
import { initialState } from '../structure'

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setIsIndexedDBInitialized(
      state,
      action: PayloadAction<typeof initialState.isIndexedDBInitialized>,
    ) {
      state.isIndexedDBInitialized = action.payload
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
