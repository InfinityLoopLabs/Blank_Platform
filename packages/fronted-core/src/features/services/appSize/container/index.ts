'use client'

import { useEffect } from 'react'
import { useSizeDetect, useDebounce } from '@infinityloop.labs/utils'
import { useDispatch, useSelector } from 'react-redux'
import { MOBILE_BREAKPOINT } from '../constants'
import { Actions } from '../store'

type AppSizeStateType = {
  appSize?: {
    isMobile?: boolean
  }
}

export const useContainer = () => {
  const dispatch = useDispatch()
  const { innerWidth, innerHeight, clientWidth, clientHeight } = useSizeDetect()
  const isMobile = useSelector((state: AppSizeStateType) =>
    Boolean(state.appSize?.isMobile),
  )

  const syncAppSize = useDebounce(
    ({
      nextClientHeight,
      nextClientWidth,
      nextInnerHeight,
      nextInnerWidth,
    }: {
      nextClientHeight: number
      nextClientWidth: number
      nextInnerHeight: number
      nextInnerWidth: number
    }) => {
      const isMobileWidth = Boolean(nextInnerWidth <= MOBILE_BREAKPOINT)

      if (isMobileWidth !== isMobile) {
        dispatch(Actions.setIsMobile(isMobileWidth))
      }

      dispatch(Actions.setScreenFlagsByWidth(nextInnerWidth))
      dispatch(
        Actions.setAppSize({
          clientHeight: nextClientHeight,
          clientWidth: nextClientWidth,
          innerHeight: nextInnerHeight,
          innerWidth: nextInnerWidth,
        }),
      )
    },
    100,
    [dispatch, isMobile],
  )

  useEffect(() => {
    syncAppSize({
      nextClientHeight: clientHeight,
      nextClientWidth: clientWidth,
      nextInnerHeight: innerHeight,
      nextInnerWidth: innerWidth,
    })
  }, [clientHeight, clientWidth, innerHeight, innerWidth, syncAppSize])
}
