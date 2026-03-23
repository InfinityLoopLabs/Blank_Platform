import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { name } from '../constants/name'
import { type PopupType } from '../lib/types'
import { initialState } from '../structure'

const slice = createSlice({
  name,
  initialState,
  reducers: {
    addModal(state, action: PayloadAction<PopupType>) {
      state.modals[action.payload.id] = action.payload
    },
    removeModal(state, action: PayloadAction<{ id: string }>) {
      delete state.modals[action.payload.id]
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
