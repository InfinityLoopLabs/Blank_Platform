import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { name } from '../constants/name'
import { initialState } from '../structure'

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<typeof initialState.isLoading>) {
      state.isLoading = action.payload
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
