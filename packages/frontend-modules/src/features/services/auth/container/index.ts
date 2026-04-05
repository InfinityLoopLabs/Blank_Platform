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
import { useSelector } from 'react-redux'
import { useRolesActions } from '../../roles/hooks/useRolesActions'
import type { RouterQueryParamsType } from '../../router/lib/types'
import { initialState as routerInitialState } from '../../router/structure'
import { LocalStorageEnum, QueryParametersEnum, RoutesEnum } from '../constants'
import { useAuthActions } from '../hooks/useAuthActions'

type RouterSliceStateType = {
  router: typeof routerInitialState
}

type AuthMeResponse = {
  user_id?: string | null
}

type RefreshResponse = {
  access_token?: string | null
  refresh_token?: string | null
}

export type AuthApiHooks = {
  useGetApiMeQuery: () => {
    data?: AuthMeResponse
    isSuccess: boolean
    refetch: () => void
  }
  usePostApiRefreshMutation: () => [
    (args?: unknown) => Promise<unknown>,
    {
      data?: RefreshResponse
      isError: boolean
      isSuccess: boolean
    },
  ]
}

export type AuthMappers = {
  authUserId: (response?: AuthMeResponse) => string | null
  refreshRequest: (params: { refreshToken: string }) => unknown
}

export type AuthServiceConfig = {
  hooks: AuthApiHooks
  mappers?: Partial<AuthMappers>
}

const defaultMappers: AuthMappers = {
  authUserId: data => data?.user_id ?? null,
  refreshRequest: ({ refreshToken }) => ({
    domainAuthRefreshRequestDto: {
      refresh_token: refreshToken,
    },
  }),
}

const throwUnconfigured = (): never => {
  throw new Error(
    'Auth container is not configured. Call auth.service({ hooks }) before injecting.',
  )
}

export const createAuthContainer = ({
  hooks,
  mappers,
}: AuthServiceConfig): SC => {
  const { useGetApiMeQuery, usePostApiRefreshMutation } = hooks
  const appliedMappers: AuthMappers = {
    ...defaultMappers,
    ...mappers,
  }
  const useContainer: SC = () => {
    // Чтение данных из store: Начало
    const { filters } = useSelector(
      (state: RouterSliceStateType) => state.router,
    )
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
        setCurrentUserID(appliedMappers.authUserId(authMeData))
      }

      if (!isAuthMeSuccess) {
        setIsAuthenticated(false)
        setCurrentUserID(null)
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
      }
    }, [isRefreshTokenError])
    // Ошибка обновления токена: Конец

    // Подписка на событие обновления токена: Начало
    useSubscribe({
      type: EventTransferActionsEnum.RefreshTokenStart,
      callback: () => {
        refreshTrigger(
          appliedMappers.refreshRequest({
            refreshToken:
              getFromLocalStorage(LocalStorageEnum.REFRESH_TOKEN) || '',
          }),
        )
      },
    })
    // Подписка на событие обновления токена: Конец
  }

  return useContainer
}

export const useContainer: SC = () => throwUnconfigured()
