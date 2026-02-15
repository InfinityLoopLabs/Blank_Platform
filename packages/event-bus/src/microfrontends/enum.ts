import { NotifyType, PopupType } from './types'

export enum EventTransferActionsEnum {
  // Обновление токена: Начало
  RefreshTokenError = 'RefreshTokenError',
  RefreshTokenStart = 'RefreshTokenStart',
  RefreshTokenComplete = 'RefreshTokenComplete',
  NavigateToAuth = 'NavigateToAuth',
  // Обновление токена: Конец

  // Уведомления: Начало
  AddNotify = 'AddNotify',
  AddPopUp = 'AddPopUp',
  RemovePopUp = 'RemovePopUp',
  // Уведомления: Конец
}

export type EventTransferPayloadType = {
  [EventTransferActionsEnum.RefreshTokenError]: {}
  [EventTransferActionsEnum.RefreshTokenStart]: {}

  [EventTransferActionsEnum.RefreshTokenComplete]: {}
  [EventTransferActionsEnum.NavigateToAuth]: {}

  // Уведомления: Начало
  [EventTransferActionsEnum.AddNotify]: {} & NotifyType
  [EventTransferActionsEnum.AddPopUp]: {} & PopupType
  [EventTransferActionsEnum.RemovePopUp]: { id: string }
  // Уведомления: Конец
}
