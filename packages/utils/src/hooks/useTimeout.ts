import { useEffect, useRef } from 'react'

/**
 * The useTimeout function is a custom hook that allows you to set up a timeout
 * and clear it. It takes two arguments: the callback function to be executed
 * after the delay, and the delay in milliseconds. The useTimeout hook returns
 * nothing; instead, it sets up an interval using React's useEffect hook. If you
 * pass null or undefined as your second argument (the delay), then no timeout will be set. You can also call this function with no arguments at all; in this case, any existing timeout will be cleared without setting another one. This is useful if you want to cancel an existing timer when some
 *
 * @example useTimeout(() => {}, 1000)
 *
 * @param callback T Type the callback function that is passed in
 * @param delay number Set the time delay in milliseconds
 *
 * @return A function that can be used to clear the timeout
 *
 */
export const useTimeout = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const savedCallback = useRef<T | null>(null)
  const id = useRef<NodeJS.Timeout | null>(null)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the timeout.
  useEffect(() => {
    const executeCallback = () => {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }

    if (delay || delay === 0) {
      id.current = setTimeout(executeCallback, delay)

      return () => {
        if (id.current) {
          clearTimeout(id.current)
        }
      }
    }
  }, [delay])
}
