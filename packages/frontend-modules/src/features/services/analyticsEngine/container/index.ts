'use client'

import { useEffect } from 'react'
import { useThrottle } from '@infinityloop.labs/utils'
import { useSelector } from 'react-redux'
import { useAnalyticsEngineActions } from '../hooks/useAnalyticsEngineActions'
import { initialState } from '../structure'

type AnalyticsEngineSliceStateType = {
  analyticsEngine: typeof initialState
}

export const useContainer: SC = () => {
  // Чтение данных из store: Начало
  const { guardPassPoints, scrollStopPoints, isAnalyticsEngineInitialized } =
    useSelector((state: AnalyticsEngineSliceStateType) => state.analyticsEngine)
  // Чтение данных из store: Конец

  // Работа с данными из store: Начало
  const { setAnalyticsEngineLoading, clearAnalyticsPoints, addYScrollPoint } =
    useAnalyticsEngineActions()
  // Работа с данными из store: Конец

  // Сброс точек аналитики при размонтировании сервиса: Начало
  useEffect(
    () => () => {
      clearAnalyticsPoints()
    },
    [clearAnalyticsPoints],
  )
  // Сброс точек аналитики при размонтировании сервиса: Конец

  // Синхронизация статуса инициализации аналитического движка: Начало
  useEffect(() => {
    const hasAnalyticsData =
      guardPassPoints.length > 0 || scrollStopPoints.length > 0

    if (hasAnalyticsData !== isAnalyticsEngineInitialized) {
      setAnalyticsEngineLoading(hasAnalyticsData)
    }
  }, [
    guardPassPoints.length,
    isAnalyticsEngineInitialized,
    scrollStopPoints.length,
    setAnalyticsEngineLoading,
  ])
  // Синхронизация статуса инициализации аналитического движка: Конец

  // Анализ скролла: Начало

  const onScrollHandler = () => {
    addYScrollPoint(window.scrollY)
  }

  const throttledScrollHandler = useThrottle(onScrollHandler, 600)

  useEffect(() => {
    window.addEventListener('scroll', throttledScrollHandler, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler)
    }
  }, [])
  // Анализ скролла: Начало: Конец
}
