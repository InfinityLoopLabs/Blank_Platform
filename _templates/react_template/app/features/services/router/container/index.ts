import { useEffect } from 'react'
import { useQueryParams } from '@infinityloop.labs/routing'
import { useLocation } from 'react-router'
import type { RoutesEnum } from '@constants/routes'
import { useAppActions } from '@hooks/useAppActions'
import type { RouterQueryParamsType } from '../lib/types'

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

export const useContainer: SC = () => {
  // Получение query параметров: Начало
  const queryParams = useQueryParams()
  // Получение query параметров: Конец

  // Получение текущего пути страницы: Начало
  const { pathname } = useLocation()
  // Получение текущего пути страницы: Конец

  // Работа с данными из store: Начало
  const {
    router: { setQueryParameters, setIsRouterInitialized, setPathNameFlags },
  } = useAppActions()
  // Работа с данными из store: Конец

  // Парсинг query params: Начало
  useEffect(() => {
    setQueryParameters(queryParams as RouterQueryParamsType)

    console.info(
      {
        queryParameters: queryParams,
      },
      `Timestamp: ${new Date().toLocaleString()}`,
    )
  }, [queryParams])
  // Парсинг query params: Конец

  // Парсинг pathname: Начало
  useEffect(() => {
    const p = pathname.split('/').filter(Boolean)
    setPathNameFlags(p[0] as RoutesEnum)
  }, [pathname])
  // Парсинг pathname: Конец

  useEffect(() => {
    setIsRouterInitialized(true)
  }, [])

  // Прокрутка страницы на верх при переходе на новую ссылку: Начало
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [queryParams, pathname])
  // Прокрутка страницы на верх при переходе на новую ссылку: Конец
}
