import { useEffect, useState } from 'react'
import { useDebounce } from './useDebounce'

/**
 * The useSizeDetect function returns an object containing the current window's innerWidth and innerHeight,
 * as well as the documentElement's clientWidth and clientHeight. These values are updated whenever a resize event is fired.
 *
 * @example const {
 *           clientHeight,
 *           clientWidth,
 *           innerHeight,
 *           innerWidth,
 *         } = useSizeDetect()
 *
 * @return An object with the following properties: {
 *         clientHeight,
 *         clientWidth,
 *         innerHeight,
 *         innerWidth,
 *       }
 *
 */
export const useSizeDetect = () => {
  const getInnerWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 0)
  const getInnerHeight = () => (typeof window !== 'undefined' ? window.innerHeight : 0)
  const getClientWidth = () => (typeof document !== 'undefined' ? document.documentElement.clientWidth : 0)
  const getClientHeight = () => (typeof document !== 'undefined' ? document.documentElement.clientHeight : 0)

  const [state, setState] = useState({
    clientHeight: getClientHeight(),
    clientWidth: getClientWidth(),
    innerHeight: getInnerHeight(),
    innerWidth: getInnerWidth(),
  })

  const widthResize = useDebounce(
    ({
      clientHeight = 0,
      clientWidth = 0,
      innerHeight = 0,
      innerWidth = 0,
    }) => {
      setState({
        clientHeight,
        clientWidth,
        innerHeight,
        innerWidth,
      })
    },
    20
  )

  const handleResize = () => {
    widthResize({
      clientHeight: getClientHeight(),
      clientWidth: getClientWidth(),
      innerHeight: getInnerHeight(),
      innerWidth: getInnerWidth(),
    })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return state
}
