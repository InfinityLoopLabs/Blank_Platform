import { createAxiosBaseQuery } from '@infinityloop.labs/common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { auth_instance } from '../../axios'

const baseQuery = createAxiosBaseQuery(auth_instance)

export const auth = createApi({
  baseQuery,
  reducerPath: 'auth-hooks',
  endpoints: () => ({}),
})

export const api = auth
