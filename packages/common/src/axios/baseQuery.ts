import { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

type AxiosBaseQueryConfigType = {
  url: string
  method?: AxiosRequestConfig['method']
  body?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
}

export const createAxiosBaseQuery =
  (instance: AxiosInstance): BaseQueryFn<AxiosBaseQueryConfigType> =>
  async ({ url, method = 'get', body: data, params }) => {
    try {
      const result = await instance({
        url,
        method,
        data,
        params,
      })

      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      console.error(axiosError)

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }
