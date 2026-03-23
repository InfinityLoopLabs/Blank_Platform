import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from '../store'

export const useAppSizeActions = () => {
  const dispatch = useDispatch()

  return useMemo(() => bindActionCreators(Actions, dispatch), [dispatch])
}
