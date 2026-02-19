import { useMemo } from 'react'
import {
  useAppSizeActions,
  useFormsActions,
  useIndexeddbActions,
  useNotifyActions,
  usePopupActions,
  useRouterActions,
  useThemeActions,
} from '@infinityloop.labs/fronted-core'
import { useDispatch } from 'react-redux'
import { type ActionCreatorsMapObject, bindActionCreators } from 'redux'
import { Actions as analyticsEngineActions } from '@services/analyticsEngine/'
import { Actions as authActions } from '@services/auth/'
import { Actions as rolesActions } from '@services/roles/'

import type { AppDispatchType } from '@application/store/store'

/**
 * Хук для создания и группировки действий из различных сервисов.
 *
 * @description
 * Этот хук использует useActions для создания объектов действий для различных сервисов.
 * Затем он возвращает объект, содержащий все эти действия, сгруппированные по сервисам,
 * что упрощает их использование в компонентах.
 *
 * Хук может быть расширен для включения дополнительных действий из сервисов и виджетов.
 * Использует useMemo для оптимизации производительности, что гарантирует,
 * что объекты действий не будут пересозданы при каждом рендере.
 *
 * @remarks
 * Если в будущем потребуется заменить Redux на другую библиотеку для управления состоянием
 * (например, Jotai или Zustand), достаточно будет изменить реализацию только в этом хуке.
 * После замены реализации на новую библиотеку, все компоненты, использующие useAppActions,
 * продолжат работать корректно, так как они будут использовать адаптированный хук с новой реализацией.
 *
 */
export const useAppActions = () => {
  const dispatch = useDispatch<AppDispatchType>()
  const appSize = useAppSizeActions()
  const forms = useFormsActions()
  const indexeddb = useIndexeddbActions()
  const notify = useNotifyActions()
  const popup = usePopupActions()
  const router = useRouterActions()
  const theme = useThemeActions()
  const createAction = <T extends ActionCreatorsMapObject>(actions: T) =>
    bindActionCreators(actions, dispatch)

  return useMemo(
    () => ({
      // insert actions here
      analyticsEngine: createAction(analyticsEngineActions),
      appSize,
      auth: createAction(authActions),
      forms,
      indexeddb,
      notify,
      popup,
      roles: createAction(rolesActions),
      router,
      theme,
    }),
    [appSize, forms, indexeddb, notify, popup, router, theme],
  )
}
