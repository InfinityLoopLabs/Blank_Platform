'use client'

import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { QueryParametersEnum, RoutesEnum } from '@constants/routes'
import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'

// Комментировать только логические блоки внутри useContainer, return не комментировать;
// Все логические блоки должны быть покрыты комментариями
// Описание: Начало
// Описание: Конец
// Старые комментарии не удалять — обновлять при изменении структуры.
// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы; булевы с префиксами is/has/should/can.
// Функции именовать on***Handler.
// Полные осмысленные имена переменных и функций.
// Запрещено: использовать useCallback/useMemo - это делает react compiler
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts
// Типы создаются и хранятся в ../lib/types/index.ts
// Данные из backend -> UI / UI -> backend пропускаются через слой ../lib/mappers/index.ts
// При работе с формами использовать useForm<HeaderFieldsType> и схему из ../lib/mappers/schemas/index.ts
// SC из глобального импорта, запрещающий вставлять что-то в аргументы контейнера
// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Нейминг данных из кверей должен быть такой:
// const {
//   data: toolbarData,
//   isLoading: isToolbarLoading,
//   isSuccess: isGetToolbarSuccess,
//   isError: isGetToolbarError,
//   refetch: refetchToolbar,
// } = useGetToolbarByIdQuery({})
// Нейминг данных из мутаций должен быть такой:
// const [
//   updateToolbarTrigger или createToolbarTrigger,
//   {
//   data: toolbarData,
//   isLoading: isToolbarLoading,
//   isSuccess: isGetToolbarSuccess,
//   isError: isGetToolbarError,
//   refetch: refetchToolbar,
//   },
// ] = useUpdateDraftMutation()

export const useContainer: SC = () => {
  // Чтение данных из store: Начало
  const { filters } = useAppSelector(state => state.router)
  // Чтение данных из store: Конец

  // Получение текущего пути: Начало
  const { pathname } = useLocation()
  // Получение текущего пути: Конец

  // Работа с данными из store: Начало
  const {
    toolbar: {
      setIsReorderModeEnabled,
      setToolbarInitialized,
      setIsEditModeEnabled,
      setIsEditModeControlVisible,
      setIsReorderModeControlVisible,
      setIsActiveBlockToolBarVisible,
      setIsEditBlockToolBarVisible,
    },
  } = useAppActions()
  // Работа с данными из store: Конец

  const isDraftsRouteActive =
    typeof pathname === 'string' &&
    (pathname === RoutesEnum.DRAFTS ||
      pathname.startsWith(`${RoutesEnum.DRAFTS}/`))

  useEffect(() => {
    setIsEditModeControlVisible(isDraftsRouteActive)
    setIsReorderModeControlVisible(isDraftsRouteActive)

    if (!isDraftsRouteActive) {
      setIsEditModeEnabled(false)
      setIsReorderModeEnabled(false)
    }
  }, [isDraftsRouteActive])

  useEffect(() => {
    const selectedModuleId =
      (filters[QueryParametersEnum.SELECTED_MODULE_ID] as string) || ''
    const selectedSocketId =
      (filters[QueryParametersEnum.SELECTED_SOCKET_ID] as string) || ''
    const hasSelection =
      selectedModuleId.length > 0 || selectedSocketId.length > 0

    setIsActiveBlockToolBarVisible(isDraftsRouteActive && !hasSelection)
    setIsEditBlockToolBarVisible(isDraftsRouteActive && hasSelection)
  }, [filters, isDraftsRouteActive])

  useEffect(() => {
    setToolbarInitialized(true)
  }, [])
}
