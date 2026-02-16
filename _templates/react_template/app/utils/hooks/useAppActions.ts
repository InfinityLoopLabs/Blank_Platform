import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { type ActionCreatorsMapObject, bindActionCreators } from 'redux'
import { Actions as analyticsEngineActions } from '@services/analyticsEngine/'
import { Actions as appSizeActions } from '@services/appSize/'
import { Actions as authActions } from '@services/auth/'
import { Actions as chartPopoverActions } from '@services/chartPopover/'
import { Actions as formsActions } from '@services/forms/'
import { Actions as indexeddbActions } from '@services/indexeddb/'
import { Actions as notifyActions } from '@services/notify/'
import { Actions as popupActions } from '@services/popup/'
import { Actions as progressActions } from '@services/progress/'
import { Actions as rolesActions } from '@services/roles/'
import { Actions as routerActions } from '@services/router/'
import { Actions as themeActions } from '@services/theme/'
import { Actions as toolbarActions } from '@services/toolbar/'
import { Actions as BreadcrumbsActions } from '@widgets/Breadcrumbs/'
import type { AppDispatchType } from '@application/store/store'
import { Actions as paletteActions } from '@services/palette/'
import { Actions as LootboxActions } from '@widgets/Lootbox/'

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
  const createAction = <T extends ActionCreatorsMapObject>(actions: T) =>
    bindActionCreators(actions, dispatch)

  return useMemo(
    () => ({
      // insert actions here
Lootbox: createAction(LootboxActions),
palette: createAction(paletteActions),
      Breadcrumbs: createAction(BreadcrumbsActions),
      analyticsEngine: createAction(analyticsEngineActions),
      appSize: createAction(appSizeActions),
      auth: createAction(authActions),
      chartPopover: createAction(chartPopoverActions),
      forms: createAction(formsActions),
      indexeddb: createAction(indexeddbActions),
      notify: createAction(notifyActions),
      popup: createAction(popupActions),
      progress: createAction(progressActions),
      roles: createAction(rolesActions),
      router: createAction(routerActions),
      theme: createAction(themeActions),
      toolbar: createAction(toolbarActions),
    }),
    [],
  )
}
