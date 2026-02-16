'use client'
import { useRef } from 'react'
import { useAppSimpleNavigation } from '@infinityloop.labs/routing'
import { useParams } from 'react-router'
import {
  QueryParametersEnum,
  QueryParametersValuesEnum,
} from '@constants/local'
import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'
import type { RouterQueryParamsType } from '@services/router/lib/types'
import {
  useGetDraftQuery,
  usePatchDraftMutation,
} from '@generated/hooks/drafts'
import { mapSampleFromDTOtoUI, mapSampleFromUItoDTO } from '../lib/mappers'

import type { SampleUIType } from '../lib/types'
import type { UIPropertyType } from '../ui'

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
// При работе с формами использовать useForm<SampleFieldsType> и схему из ../lib/mappers/schemas/index.ts
// CC из глобального импорта, запрещающий вставлять что-то в аргументы контейнера
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Нейминг данных из кверей должен быть такой:
// const {
//   data: sampleData,
//   isLoading: isSampleLoading,
//   isSuccess: isGetSampleSuccess,
//   isError: isGetSampleError,
//   refetch: refetchSample,
// } = useGetSampleByIdQuery({})
// Нейминг данных из мутаций должен быть такой:
// const [
//   updateSampleTrigger или createSampleTrigger,
//   {
//   data: sampleData,
//   isLoading: isSampleLoading,
//   isSuccess: isGetSampleSuccess,
//   isError: isGetSampleError,
//   refetch: refetchSample,
//   },
// ] = useUpdateDraftMutation()

export const useContainer: CC<UIPropertyType> = () => {
  // Чтение данных из store: Начало
  const { filters } = useAppSelector(state => state.router)
  // Чтение данных из store: Конец

  // Работа с данными из store: Начало
  const {} = useAppActions()
  // Работа с данными из store: Конец

  // Логика навигации: Начало
  const navigate = useAppSimpleNavigation()
  const { pathname } = useParams()

  // Создаем ref для хранения актуальных параметров и избежания замыканий
  const paramsRef = useRef<RouterQueryParamsType>(filters)
  paramsRef.current = filters

  const onNavigateHandler = (id: QueryParametersValuesEnum) => {
    navigate(null, {
      ...paramsRef.current,
      [QueryParametersEnum.PAGE]: 1,
    })
  }
  // Логика навигации: Конец

  // Логика включения/выключения компонента: Начало
  const isEnabled = true
  // Логика включения/выключения компонента: Конец

  // Mapping данных для UI: Начало
  const sampleDataForUI: SampleUIType = {}
  // Mapping данных для UI: Конец

  // Логика включения/выключения скелетонов: Начало
  const isLoading = true
  // Логика включения/выключения скелетонов: Конец

  return {
    isEnabled,
    isLoading,
    ...sampleDataForUI,
  }
}
