import { useEffect } from 'react'
import { EventTransferActionsEnum } from './enum'
import { SubscribeType } from './types'

// Перегрузка для обновления токена: Начало
export function useSubscribe(
  payload: SubscribeType<EventTransferActionsEnum.RefreshTokenStart>,
): void

export function useSubscribe(
  payload: SubscribeType<EventTransferActionsEnum.RefreshTokenError>,
): void

export function useSubscribe(
  payload: SubscribeType<EventTransferActionsEnum.RefreshTokenComplete>,
): void
// Перегрузка для обновления токена: Конец

// Уведомления: Начало
export function useSubscribe(
  payload: SubscribeType<EventTransferActionsEnum.AddNotify>,
): void

// Модальные окна
export function useSubscribe(
  payload: SubscribeType<EventTransferActionsEnum.AddPopUp>,
): void
export function useSubscribe(
  payload: SubscribeType<EventTransferActionsEnum.RemovePopUp>,
): void
// Уведомления: Конец

// Перегрузка для редиректа из interceptor: Начало
export function useSubscribe(
  payload: SubscribeType<EventTransferActionsEnum.NavigateToAuth>,
): void
// Перегрузка для редиректа из interceptor: Конец

// Основная реализация: Начало
export function useSubscribe<T extends EventTransferActionsEnum>(
  payload: SubscribeType<T>,
): void {
  const { type, callback, isDebugMode, deps } = payload
  const dependency = deps || []
  const eventHandler = (event: CustomEvent) => {
    if (isDebugMode) {
      console.log(event.detail.data)
    }
    callback(event.detail.data)
  }

  useEffect(() => {
    window.addEventListener(type, eventHandler as EventListener)
    if (isDebugMode) {
      console.log('Subscribe: ', type)
    }

    return () => {
      window.removeEventListener(type, eventHandler as EventListener)
      if (isDebugMode) {
        console.log('Unsubscribe: ', type)
      }
    }
  }, [...dependency])
}
// Основная реализация: Конец
