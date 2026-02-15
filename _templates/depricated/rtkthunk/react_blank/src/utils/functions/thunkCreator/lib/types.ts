import { SerializedError } from '@reduxjs/toolkit'
import { AxiosRequestConfig } from 'axios'

export type RejectValueType = SerializedError

export type ThunkErrorType = {
  rejectValue: RejectValueType
}

export type WithoutOptionsType<T extends UnknownCallback> = ExcludeLastType<
  Parameters<T>
>
export type ExcludeLastType<T extends any[]> = T extends [
  ...infer R,
  AxiosRequestConfig
]
  ? R
  : never
