import {
  eventTransfer,
  EventTransferActionsEnum,
} from '@infinityloop.labs/event-bus'
import { Mutex } from 'async-mutex'
import { AxiosInstance } from 'axios'

/**
 * Функция waitForTokenRefresh — это вспомогательная функция, которая повторяет запрос после
 * обновление токена. Он повторит попытку только 3 раза, а затем выдаст ошибку.
 *
 * @param error Передать объект ошибки, который был выброшен.
 * @param mutex401 Предотвращает одновременную отправку нескольких запросов на сервер.
 * @param instance AxiosInstance
 *
 * @return A promise that resolves when the token has been refreshed
 *
 */
export const waitForTokenRefresh = async (
  error: any,
  mutex401: Mutex,
  instance: AxiosInstance,
) => {
  if (error.response.status !== 401) {
    return
  }

  const request = error.config
  request.errorsCount = request.errorsCount || 0

  if (request.errorsCount >= 3) {
    eventTransfer({
      name: EventTransferActionsEnum.RefreshTokenError,
      data: {},
    })

    throw error
  }

  // Увеличиваем счетчик ошибок
  request.errorsCount += 1
  // Обработка 401 ошибки: Начало
  if (!mutex401.isLocked()) {
    const release = await mutex401.acquire()

    eventTransfer({
      name: EventTransferActionsEnum.RefreshTokenStart,
      data: {},
    })

    await new Promise<void>(resolve => {
      const onRefreshTokenComplete = () => {
        window.removeEventListener(
          EventTransferActionsEnum.RefreshTokenComplete,
          onRefreshTokenComplete,
        )
        resolve()
      }

      window.addEventListener(
        EventTransferActionsEnum.RefreshTokenComplete,
        onRefreshTokenComplete,
      )
    })

    release() // Только после получения события, явно освобождаем мьютекс

    return instance.request(request)
  } else {
    await mutex401.waitForUnlock()

    return instance.request(request)
  }
  // Обработка 401 ошибки: Конец
}
