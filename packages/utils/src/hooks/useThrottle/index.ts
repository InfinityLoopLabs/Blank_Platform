import { useCallback } from 'react'
import { throttle } from '../../utils'

type OptionsType = Partial<{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  leading: boolean
  // eslint-disable-next-line @typescript-eslint/naming-convention
  trailing: boolean
}>

interface IThrottle<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined

  cancel(): void

  flush(): ReturnType<T> | undefined
}

/**
 * The useThrottle function is a React hook that returns a throttled version of the callback function passed to it.
 * The returned function will only be called once every `delay` milliseconds, and will not be called again until
 * after the delay has elapsed. This can help prevent performance issues when calling an expensive callback too often.
 *
 * @example const log = useThrottle((params) => console.log(params), 1000);
 *
 * @param callback automatically inferred type of function
 * @param delay number Set the delay between each call to the callback
 * @param deps Determine when the callback should be re-created
 * @param options OptionsType Pass in the trailing and leading options
 *
 * @return A throttled function
 *
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps = [] as any[],
  options?: OptionsType,
): IThrottle<T> =>
  useCallback(
    throttle((...args: Parameters<T>) => callback(...args), delay, {
      trailing: options?.trailing || false,
      leading: options?.leading || true,
    }),
    [delay, ...deps],
  )
