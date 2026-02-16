import { createAxiosBaseQuery } from '@infinityloop.labs/common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { drafts_instance } from '../../axios'

const baseQuery = createAxiosBaseQuery(drafts_instance)

export const drafts = createApi({
  baseQuery,
  reducerPath: 'drafts-hooks',
  endpoints: () => ({}),
})

// Для инъекции в generated hooks
export const api = drafts
