import { waitForTokenRefresh } from '@infinityloop.labs/common'
import { getFromLocalStorage } from '@infinityloop.labs/utils'
import { Mutex } from 'async-mutex'
import axios from 'axios'
import {
  BACKEND_AUTH_URL,
  BACKEND_DRAFTS_URL,
  LocalStorageEnum,
} from '@constants/local'

// Получение ссылки на backend из local environment

// Объявление изначальных Headers
export const headers = {
  Authorization: '',
}

// Создаем экземпляр Mutex
// Для другого перехватчика, лучше создать отдельный экземпляр
const mutex401 = new Mutex()

export const auth_instance = axios.create({
  baseURL: BACKEND_AUTH_URL,
  headers,
  // withCredentials: true,
})

export const drafts_instance = axios.create({
  baseURL: BACKEND_DRAFTS_URL,
  headers,
  // withCredentials: true,
})

// Перехватчики запросов: Начало
auth_instance.interceptors.request.use(config => {
  config.headers!.Authorization = `Bearer ${getFromLocalStorage(LocalStorageEnum.ACCESS_TOKEN)}`

  return config
})

drafts_instance.interceptors.request.use(config => {
  config.headers!.Authorization = `Bearer ${getFromLocalStorage(LocalStorageEnum.ACCESS_TOKEN)}`

  return config
})
// Перехватчики запросов: Конец

// Перехватчики ответов: Начало
drafts_instance.interceptors.response.use(
  config => config,
  async error => await waitForTokenRefresh(error, mutex401, drafts_instance),
)

auth_instance.interceptors.response.use(
  config => config,
  async error => await waitForTokenRefresh(error, mutex401, auth_instance),
)
// Перехватчики ответов: Конец
