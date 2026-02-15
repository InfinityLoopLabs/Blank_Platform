import { Dispatch } from 'redux'
import { RejectValueType } from '@functions/thunkCreator/lib/types'

export type ThunkAPIType = {
  dispatch: Dispatch
  rejectWithValue: Function
}

export const handleThunkError = (
  { message }: RejectValueType,
  thunkAPI: ThunkAPIType
) => {
  if (message) {
    // thunkAPI.dispatch(
    //   condition.enqueueNotification({
    //     variant: 'error',
    //     message,
    //   })
    // )
  }

  return thunkAPI.rejectWithValue({ message })
}

export const handleThunkSuccess = (
  { message }: RejectValueType,
  thunkAPI: ThunkAPIType
) => {
  if (message) {
    // thunkAPI.dispatch(
    //   condition.enqueueNotification({
    //     variant: 'success',
    //     message,
    //   })
    // )
  }
}
