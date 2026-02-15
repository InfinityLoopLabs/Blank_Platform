import { EventTransferActionsEnum, EventTransferPayloadType } from '../enum'

export type EventTransferGenericPayloadType<
  T extends EventTransferActionsEnum
> = {
  data: EventTransferPayloadType[T]
  isDebugMode?: boolean
  name: T
}

export type SubscribeType<T extends EventTransferActionsEnum> = {
  type: T
  callback: (value: EventTransferPayloadType[T]) => void
  isDebugMode?: boolean
  deps?: any[]
}
