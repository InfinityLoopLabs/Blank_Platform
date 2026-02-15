import { InternalAxiosRequestConfig } from 'axios'

export const addTokenInterceptor = (
  config: InternalAxiosRequestConfig<any>
) => {
  if (localStorage.getItem('token')) {
    config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`
  }
}
