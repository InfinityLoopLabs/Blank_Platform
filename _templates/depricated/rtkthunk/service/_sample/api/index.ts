import { AxiosRequestConfig } from 'axios'
import { instance } from '@app/api/axios'

export const RestAPI = {
  async get(
    payload: { name: string },
    anotherPayload: string,
    options: AxiosRequestConfig
  ) {
    return await instance.get<{}>('todos/', options)
  },
}
