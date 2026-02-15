import { useEffect, useRef } from 'react'

/**
 * The useInterval function is a custom React hook that allows you to set up an interval
 * and clear it using the standard useEffect() hook.
 * @example useInterval(() => {}, 1000);
 *
 * @param callback T Specify the type of callback function
 * @param delay number Set the interval of the timer
 *
 * @return Void
 *
 */
export const useInterval = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) => {
  const savedCallback = useRef<T | null>(null)
  const id = useRef<NodeJS.Timeout>(undefined)
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }

    if (delay || delay === 0) {
      id.current = setInterval(tick, delay)

      return () => {
        clearInterval(id.current)
      }
    }
  }, [delay])
}
