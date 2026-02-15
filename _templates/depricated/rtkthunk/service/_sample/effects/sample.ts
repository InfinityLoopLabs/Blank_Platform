import { createAsyncThunk } from '@reduxjs/toolkit'
import { CreateThunkType, thunkCreator } from 'utils/functions/thunkCreator'
import { RestAPI } from '../api'
import { name } from '../constants/name'

const typePrefix = `${name}/GetUsersTC`
type ThunkType = CreateThunkType<typeof RestAPI.get>

export const getUsersTC = createAsyncThunk<
  ThunkType['Return'],
  ThunkType['Payload'],
  ThunkType['Error']
>(
  typePrefix,
  async (payload, thunkAPI) =>
    await thunkCreator(
      {
        apiMethod: signal => RestAPI.get(...payload, { signal }),
        requestKey: typePrefix,
      },
      thunkAPI
    )
)
