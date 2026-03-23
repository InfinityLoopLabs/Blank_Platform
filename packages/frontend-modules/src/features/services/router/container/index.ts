import { useEffect } from 'react'
import { useQueryParams } from '@infinityloop.labs/routing'
import { useLocation } from 'react-router'
import { useRouterActions } from '../hooks/useRouterActions'
import type { RouterQueryParamsType } from '../lib/types'

export const useContainer = () => {
  const queryParams = useQueryParams()
  const { pathname } = useLocation()
  const { setQueryParameters, setIsRouterInitialized, setPathNameFlags } =
    useRouterActions()

  useEffect(() => {
    setQueryParameters(queryParams as RouterQueryParamsType)
  }, [queryParams])

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    setPathNameFlags(pathSegments[0])
  }, [pathname])

  useEffect(() => {
    setIsRouterInitialized(true)
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [pathname])
}
