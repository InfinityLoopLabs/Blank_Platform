import {
  EventTransferActionsEnum,
  type PopupType,
  useSubscribe,
} from '@infinityloop.labs/event-bus'
import { useDispatch } from 'react-redux'
import { Actions } from '../store'

export const useContainer = () => {
  const dispatch = useDispatch()

  const onAddModalHandler = (payload: PopupType) => {
    dispatch(Actions.addModal(payload))
  }

  const onRemoveModalHandler = (payload: { id: string }) => {
    dispatch(Actions.removeModal(payload))
  }

  useSubscribe({
    type: EventTransferActionsEnum.AddPopUp,
    callback: onAddModalHandler,
  })

  useSubscribe({
    type: EventTransferActionsEnum.RemovePopUp,
    callback: onRemoveModalHandler,
  })
}
