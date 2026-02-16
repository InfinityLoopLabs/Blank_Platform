'use client'

import { useEffect, useRef } from 'react'
import {
  eventTransfer,
  EventTransferActionsEnum,
  useSubscribe,
} from '@infinityloop.labs/event-bus'
import {
  useAppLocation,
  useAppSimpleNavigation,
} from '@infinityloop.labs/routing'
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '@infinityloop.labs/utils'
import {
  LocalStorageEnum,
  QueryParametersEnum,
  RoutesEnum,
} from '@constants/local'
import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'
import type { RouterQueryParamsType } from '@services/router/lib/types'
import {
  useGetApiMeQuery,
  usePostApiRefreshMutation,
} from '@generated/hooks/auth'

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
  // Чтение данных из store: Начало
  // const { isAuthenticated } = useAppSelector(state => state.auth)
  const { filters } = useAppSelector(state => state.router)
  // Чтение данных из store: Конец

  // Работа с данными из store: Начало
  const {
    auth: { setIsAuthenticated },
    roles: { setCurrentUserID },
  } = useAppActions()
  // Работа с данными из store: Конец

  // Навигация: Начало
  const navigate = useAppSimpleNavigation()
  // Навигация: Конец

  // Создаем ref для хранения актуальных параметров и избежания замыканий
  const paramsRef = useRef<RouterQueryParamsType>(filters)
  paramsRef.current = filters

  // Определение страницы: Начало
  const { pathname } = useAppLocation()
  const isLoginPage = !!pathname.match(RoutesEnum.LOGIN)
  // Определение страницы: Конец

  // Обработчик перехода на страницу логина: Начало
  // const onNavigateToLoginPageHandler = () => {
  //   navigate(RoutesEnum.LOGIN)
  //   setToLocalStorage<string>(
  //     LocalStorageEnum.LAST_PAGE_BEFORE_LOGIN,
  //     window.location.pathname,
  //   )
  // }
  // Обработчик перехода на страницу логина: Конец

  // Обработчик возврата с логина: Начало
  const onNavigateFromLoginPageHandler = () => {
    const lastPageBeforeLogin = getFromLocalStorage<string>(
      LocalStorageEnum.LAST_PAGE_BEFORE_LOGIN,
    )

    if (
      lastPageBeforeLogin?.match(RoutesEnum.LOGIN) ||
      lastPageBeforeLogin?.trim()
    ) {
      navigate(lastPageBeforeLogin || '/', {
        ...paramsRef.current,
        [QueryParametersEnum.REFRESH_TOKEN]: '',
        [QueryParametersEnum.ACCESS_TOKEN]: '',
      })
    } else {
      navigate('/')
    }

    setToLocalStorage(LocalStorageEnum.LAST_PAGE_BEFORE_LOGIN, '')
  }
  // Обработчик возврата с логина: Конец

  // Сохранение токенов из query-параметров: Начало
  useEffect(() => {
    if (filters[QueryParametersEnum.ACCESS_TOKEN]) {
      setToLocalStorage(
        LocalStorageEnum.ACCESS_TOKEN,
        filters[QueryParametersEnum.ACCESS_TOKEN],
      )
    }

    if (filters[QueryParametersEnum.REFRESH_TOKEN]) {
      setToLocalStorage(
        LocalStorageEnum.REFRESH_TOKEN,
        filters[QueryParametersEnum.REFRESH_TOKEN],
      )
    }
  }, [filters])
  // Сохранение токенов из query-параметров: Конец

  // Получение информации о пользователе: Начало
  const {
    data: authMeData,
    isSuccess: isAuthMeSuccess,
    refetch,
  } = useGetApiMeQuery()
  // Получение информации о пользователе: Конец

  // Авторизация: Начало
  useEffect(() => {
    if (isAuthMeSuccess) {
      if (isLoginPage) {
        onNavigateFromLoginPageHandler()
      } else {
        navigate(null, {
          ...paramsRef.current,
          [QueryParametersEnum.REFRESH_TOKEN]: '',
          [QueryParametersEnum.ACCESS_TOKEN]: '',
        })
      }
      setIsAuthenticated(true)
      setCurrentUserID(authMeData?.user_id || null)
    }

    if (!isAuthMeSuccess) {
      setIsAuthenticated(false)
      setCurrentUserID(null)
      // onNavigateToLoginPageHandler()
    }
  }, [isAuthMeSuccess])
  // Авторизация: Конец

  // Запрос обновления токена: Начало
  const [
    refreshTrigger,
    {
      data: refreshTokenData,
      isError: isRefreshTokenError,
      isSuccess: isRefreshTokenSuccess,
    },
  ] = usePostApiRefreshMutation()
  // Запрос обновления токена: Конец

  // Успешное обновление токена: Начало
  useEffect(() => {
    if (isRefreshTokenSuccess && refreshTokenData) {
      setToLocalStorage(
        LocalStorageEnum.ACCESS_TOKEN,
        refreshTokenData.access_token ?? '',
      )
      setToLocalStorage(
        LocalStorageEnum.REFRESH_TOKEN,
        refreshTokenData.refresh_token ?? '',
      )
      eventTransfer({
        name: EventTransferActionsEnum.RefreshTokenComplete,
        data: {},
      })
      refetch()
    }
  }, [isRefreshTokenSuccess, refreshTokenData])
  // Успешное обновление токена: Конец

  // Ошибка обновления токена: Начало
  useEffect(() => {
    if (isRefreshTokenError) {
      eventTransfer({
        name: EventTransferActionsEnum.RefreshTokenError,
        data: {},
      })
      // onNavigateToLoginPageHandler()
    }
  }, [isRefreshTokenError])
  // Ошибка обновления токена: Конец

  // Подписка на событие обновления токена: Начало
  useSubscribe({
    type: EventTransferActionsEnum.RefreshTokenStart,
    callback: () => {
      refreshTrigger({
        domainAuthRefreshRequestDto: {
          refresh_token:
            getFromLocalStorage(LocalStorageEnum.REFRESH_TOKEN) || '',
        },
      })
    },
  })
  // Подписка на событие обновления токена: Конец
}
