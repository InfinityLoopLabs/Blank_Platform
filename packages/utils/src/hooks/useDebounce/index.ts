import { useCallback } from 'react'
import { debounce } from '../../utils'

type OptionsType = Partial<{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  leading: boolean
  // eslint-disable-next-line @typescript-eslint/naming-convention
  trailing: boolean
  maxWait: number
}>

interface IDebounce<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined

  cancel(): void

  flush(): ReturnType<T> | undefined
}

/**
 * The useDebounce function is a React hook that returns a debounced version of the callback function.
 *
 * @example const log = useDebounce((params) => console.log(params), 1000);
 *
 * @param callback automatically inferred type of function
 * @param delay number Determine how long to wait before
 * @param deps Tell react when to recreate the useDebounce hook
 * @param options OptionsType Pass in the trailing and leading options
 *
 * @return A function that is debounced
 *
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps = [] as any[],
  options?: OptionsType,
): IDebounce<T> =>
  useCallback(
    debounce((...args: Parameters<T>) => callback(...args), delay, options),
    [delay, ...deps],
  )
