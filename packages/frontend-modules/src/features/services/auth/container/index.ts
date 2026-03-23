'use client'

import { useEffect, useRef } from 'react'
import {
  useGetApiMeQuery,
  usePostApiRefreshMutation,
} from '@generated/hooks/auth'
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
import { useSelector } from 'react-redux'
import { useRolesActions } from '../../roles/hooks/useRolesActions'
import type { RouterQueryParamsType } from '../../router/lib/types'
import { initialState as routerInitialState } from '../../router/structure'
import { LocalStorageEnum, QueryParametersEnum, RoutesEnum } from '../constants'
import { useAuthActions } from '../hooks/useAuthActions'

type RouterSliceStateType = {
  router: typeof routerInitialState
}

export const useContainer: SC = () => {
  // Чтение данных из store: Начало
  // const { isAuthenticated } = useAppSelector(state => state.auth)
  const { filters } = useSelector((state: RouterSliceStateType) => state.router)
  // Чтение данных из store: Конец

  // Работа с данными из store: Начало
  const { setIsAuthenticated } = useAuthActions()
  const { setCurrentUserID } = useRolesActions()
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
