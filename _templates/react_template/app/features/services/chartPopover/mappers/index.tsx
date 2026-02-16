import type { AppStateType } from '@application/store/store'
import { createSelector } from '@reduxjs/toolkit'

const selectOne = (state: AppStateType) => state
const selectTwo = (state: AppStateType) => state

export const chartPopoverSelector = createSelector(
  selectOne,
  selectTwo,
  (one, two) => ({
    one,
    two,
  }),
)
