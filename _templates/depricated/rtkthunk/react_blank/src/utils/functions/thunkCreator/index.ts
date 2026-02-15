import { AxiosError } from 'axios'
import {
  handleThunkError,
  handleThunkSuccess,
  ThunkAPIType,
} from '@functions/thunkCreator/lib/appStatusHandlers'
import {
  ThunkErrorType,
  WithoutOptionsType,
} from '@functions/thunkCreator/lib/types'

type ThunkCreatorType = {
  apiMethod: (signal: AbortSignal) => any
  requestKey: string

  status?: number

  onSuccess?: () => void
  onError?: () => void

  notification?: {
    successMessage?: string
    errorMessage?: string
  }
}

// Хранилище ключей
const activeRequestControllers = new Map<string, AbortController>()

export const thunkCreator = async (
  {
    notification,
    onError,
    onSuccess,
    apiMethod,
    requestKey,
    status = 200,
  }: ThunkCreatorType,
  thunkAPI: ThunkAPIType
) => {
  // AbortController: Начало
  const controller = new AbortController()

  const existingController = activeRequestControllers.get(requestKey)

  if (existingController) {
    existingController.abort()
  }

  activeRequestControllers.set(requestKey, controller)
  // AbortController: Конец

  // Успешная обработка: Начало
  try {
    const res = await apiMethod(controller.signal)

    // Удаляем ключ из хранилища
    activeRequestControllers.delete(requestKey)

    if (res.status === status) {
      handleThunkSuccess({ message: notification?.successMessage }, thunkAPI)
      onSuccess && onSuccess()

      return res.data
    }
    // Успешная обработка: Конец

    // Обработка ошибки: Начало
  } catch (e) {
    const error = e as AxiosError

    // Удаляем ключ из хранилища
    activeRequestControllers.delete(requestKey)

    onError && onError()

    return handleThunkError(
      { message: notification?.errorMessage || error.message },
      thunkAPI
    )
  }
  // Обработка ошибки: Конец
}

export type CreateThunkType<T extends UnknownCallback> = {
  Return: T
  Payload: WithoutOptionsType<T>
  Error: ThunkErrorType
}
