import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { name } from '../constants/name'
import type { FormInRegistryType } from '../lib/types'
import { initialState } from '../structure'

const slice = createSlice({
  name,
  initialState,
  reducers: {
    registerForm: (state, action: PayloadAction<FormInRegistryType>) => {
      state.formsRegistry[action.payload.id] = action.payload
    },
    unregisterForm: (state, action: PayloadAction<string>) => {
      delete state.formsRegistry[action.payload]
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
