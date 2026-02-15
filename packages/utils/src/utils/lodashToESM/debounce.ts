import { root } from './freeGlobal'

export type DebounceOptionsType = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  leading?: boolean
  maxWait?: number
  // eslint-disable-next-line @typescript-eslint/naming-convention
  trailing?: boolean
}

export type DebouncedFunctionType<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): ReturnType<T> | undefined
  cancel: () => void
  flush: () => ReturnType<T> | undefined
  pending: () => boolean
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: DebounceOptionsType,
): DebouncedFunctionType<T> {
  let lastArgs: Parameters<T> | undefined
  let lastThis: any
  let maxWait: number | undefined
  let result: ReturnType<T> | undefined
  let timerId: number | undefined
  let lastCallTime: number | undefined
  let lastInvokeTime = 0
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let leading = false
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let maxing = false
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const useRAF =
    !wait && wait !== 0 && typeof root.requestAnimationFrame === 'function'

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }

  if (options && typeof options === 'object') {
    leading = !!options.leading
    maxing = 'maxWait' in options
    // @ts-ignore
    maxWait = maxing ? Math.max(+options?.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args as any)

    return result
  }

  function startTimer(pendingFunc: () => void, milliseconds: number): number {
    if (useRAF) {
      cancelAnimationFrame(timerId as number)

      return requestAnimationFrame(pendingFunc)
    }

    // @ts-ignore
    return setTimeout(pendingFunc, milliseconds)
  }

  function cancelTimer(id: number): void {
    if (useRAF) {
      cancelAnimationFrame(id)

      return
    }
    clearTimeout(id)
  }

  function leadingEdge(time: any) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait)

    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time: any) {
    // @ts-ignore
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing
      ? // @ts-ignore
        Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time: any) {
    // @ts-ignore
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      // @ts-ignore
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))

    return undefined
  }

  function trailingEdge(time: any) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined

    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait)

        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }

    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending

  return debounced
}
