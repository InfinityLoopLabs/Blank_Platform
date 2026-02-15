import { useCallback } from 'react'
import { createQueryParams } from '../utils'
import { encryptQueryParams } from './queryEncryption'
import { useAppNavigate } from './useAppNavigate.ts'

/**
 * Хук для изменения параметров URL в приложении.
 * @returns {Object} Функция для навигации с параметрами.
 */
export const useAppSimpleNavigation = () => {
  const navigate = useAppNavigate()

  return useCallback((path: string | null, param?: Record<string, any>) => {
    const queryParams = param ? createQueryParams(param) : ''
    const search = queryParams
      ? `?q=${encodeURIComponent(btoa(encryptQueryParams(btoa(queryParams))))}`
      : ''

    navigate(`${path ? path : ''}${search}`, {
      replace: true,
    })
  }, [])
}
