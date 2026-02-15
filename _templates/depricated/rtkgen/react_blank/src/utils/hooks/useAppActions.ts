import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { ActionCreatorsMapObject, bindActionCreators } from 'redux'
import { AppDispatchType } from '@app/store/store'
import { Actions as appSizeActions } from '@services/appSize/'

// useAppActions - этот хук использует useActions для создания объектов действий для различных сервисов.
// Затем он возвращает объект, содержащий все эти действия, сгруппированные по сервисам, что упрощает их использование
// в компонентах. Этот хук может быть расширен для включения дополнительных действий из сервисов и виджетов.
// Хук использует useMemo для оптимизации производительности, что гарантирует, что объекты действий не будут пересозданы.

// Если в будущем вы захотите заменить Redux на другую библиотеку для управления состоянием, например Jotai или Zustand,
// вам нужно будет изменить реализацию только в этом хуке. После замены реализации на новую библиотеку, все компоненты,
// которые используют useAppActions, продолжат работать корректно, так как они будут использовать адаптированный
// хук с новой реализацией.
export const useAppActions = () => {
  const dispatch = useDispatch<AppDispatchType>()
  const createAction = <T extends ActionCreatorsMapObject>(actions: T) =>
    bindActionCreators(actions, dispatch)

  return useMemo(
    () => ({
      // insert actions here
      appSize: createAction(appSizeActions),
    }),
    []
  )
}
