import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { decryptQueryParams } from './queryEncryption'

type PrimitiveType = string | number | boolean
export type QueryParamsType = Record<
  string,
  PrimitiveType | PrimitiveType[] | Record<string, PrimitiveType>[]
>

/**
 * Преобразует строку в число или булево, если возможно.
 * @param {string} value - Значение для преобразования.
 * @return {string | number | boolean} - Преобразованное значение.
 */
const parseValue = (
  value: string,
): string | number | boolean | PrimitiveType[] => {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  if (value.includes('[') && value.includes(']')) {
    return JSON.parse(String(value))
  }
  const numValue = Number(value)

  return isNaN(numValue) ? value : numValue
}

/**
 * Проверяет, что строка является JSON-массивом объектов и парсит его.
 */
const tryParseObjectArray = (
  raw: string,
): Record<string, any>[] | undefined => {
  const trimmed = raw.trim()
  if (!/^\[\s*{/.test(trimmed)) {
    return undefined
  }
  try {
    const parsed = JSON.parse(trimmed)

    return Array.isArray(parsed) &&
      parsed.every(el => el && typeof el === 'object' && !Array.isArray(el))
      ? parsed
      : undefined
  } catch {
    return undefined
  }
}

export const handleParams = (params: URLSearchParams) =>
  Array.from(params).reduce<QueryParamsType>((acc, [key, value]) => {
    const normalized = key.replace(/\[\]$/, '')
    const objArr = tryParseObjectArray(value)

    if (objArr) {
      acc[normalized] = objArr

      return acc
    }

    const prepared = parseValue(value)

    if (acc[normalized] === undefined) {
      acc[normalized] = prepared
    } else if (Array.isArray(acc[normalized])) {
      ;(acc[normalized] as (PrimitiveType | Record<string, any>)[]).push(
        prepared,
      )
    } else {
      acc[normalized] = [
        acc[normalized] as PrimitiveType,
        prepared as PrimitiveType,
      ]
    }

    if (
      typeof acc[normalized] === 'string' &&
      (acc[normalized] as string).includes(',')
    ) {
      acc[normalized] = (acc[normalized] as string).split(',')
    }

    return acc
  }, {})

/**
 * The useQueryParams function returns an object containing the query parameters of the current URL.
 * It is a hook that uses useLocation from React Router to get the current URL and parses it using URLSearchParams.
 * The parsed query parameters are then returned as an object, with each key being a parameter name and its value being either a string or array of strings (if there are multiple values for one parameter).
 * @example const params = useQueryParams()
 *
 * @return An object with the query parameters
 *
 */
export const useQueryParams = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location?.search)

  return useMemo(() => {
    // Если есть параметр "q", пытаемся его декодировать
    if (searchParams.has('q')) {
      try {
        const encrypted = searchParams.get('q') as string
        const decrypted = decryptQueryParams(atob(encrypted))
        const decodedQ = decrypted ? atob(decrypted) : ''

        if (!decodedQ) {
          return {}
        }
        return handleParams(new URLSearchParams(decodedQ))
      } catch {
        return {}
      }
    }

    return handleParams(searchParams)
  }, [location?.search])
}
