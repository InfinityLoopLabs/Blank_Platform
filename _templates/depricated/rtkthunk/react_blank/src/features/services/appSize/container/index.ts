import { useSizeDetect } from '@npm.piece/utils'
import { useEffect } from 'react'
import { useAppActions } from '@hooks/useAppActions'
import { useAppSelector } from '@hooks/useAppSelector'

export const useContainer: SC = () => {
  const { innerWidth, innerHeight, clientWidth, clientHeight } = useSizeDetect()
  const isMobile = useAppSelector(state => state.appSize.isMobile)
  const isMobileWidth = Boolean(innerWidth <= 768)

  const {
    appSize: { setIsMobile, setAppSize },
  } = useAppActions()

  useEffect(() => {
    if (isMobileWidth !== isMobile) {
      setIsMobile(isMobileWidth)
    }
  }, [isMobile, isMobileWidth])

  useEffect(() => {
    setAppSize({
      clientHeight,
      clientWidth,
      innerHeight,
      innerWidth,
    })
  }, [clientHeight, clientWidth, innerHeight, innerWidth])
}
