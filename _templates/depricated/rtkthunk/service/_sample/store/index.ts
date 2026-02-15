import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { name } from '../constants/name'
import { asyncActions } from '../effects/export'
import { initialState } from '../structure'

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<typeof initialState.isLoading>) {
      state.isLoading = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(asyncActions.getUsersTC.fulfilled, (state, action) => {
        // state.users = action.payload;
        state.isLoading = false
      })
      .addCase(asyncActions.getUsersTC.pending, state => {
        state.isLoading = true
      })
      .addCase(asyncActions.getUsersTC.rejected, state => {
        state.isLoading = false
      })
  },
})

export const Actions = {
  ...slice.actions,
  ...asyncActions,
}

export const Reducer = slice.reducer
