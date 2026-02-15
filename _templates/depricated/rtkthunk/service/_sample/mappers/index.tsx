import { createSelector } from 'reselect'
import { AppStateType } from '@app/store/store'

const selectOne = (state: AppStateType) => state
const selectTwo = (state: AppStateType) => state

const simple = createSelector(selectOne, selectTwo, (one, two) => ({
  one,
  two,
}))
