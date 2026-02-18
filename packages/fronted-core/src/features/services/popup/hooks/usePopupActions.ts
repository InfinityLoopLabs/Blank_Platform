import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from '../store'

export const usePopupActions = () => {
  const dispatch = useDispatch()

  return useMemo(() => bindActionCreators(Actions, dispatch), [dispatch])
}
