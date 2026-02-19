import {
  EventTransferActionsEnum,
  useSubscribe,
} from '@infinityloop.labs/event-bus'
import { useNotifyActions } from '../hooks/useNotifyActions'

export const useContainer = () => {
  const { addNotify } = useNotifyActions()

  useSubscribe({
    type: EventTransferActionsEnum.AddNotify,
    callback: addNotify,
  })
}
