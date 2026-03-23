import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { name } from '../constants'
import type { NotifyType } from '../lib/types'
import { initialState } from '../structure'

const slice = createSlice({
  name,
  initialState,
  reducers: {
    addNotify(state, action: PayloadAction<NotifyType>) {
      state.notifyArray.push(action.payload)
    },
    removeNotify(state) {
      state.notifyArray.shift()
    },
  },
})

export const Actions = {
  ...slice.actions,
}

export const Reducer = slice.reducer
