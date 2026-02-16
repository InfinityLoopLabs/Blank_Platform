import type { Dispatch, Store, UnknownAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'

export const createReduxHooks = <
  RootState,
  AppDispatch extends Dispatch<UnknownAction>,
  AppStore extends Store = Store,
>() => ({
  useAppDispatch: useDispatch.withTypes<AppDispatch>(),
  useAppSelector: useSelector.withTypes<RootState>(),
  useAppStore: useStore.withTypes<AppStore>(),
})
