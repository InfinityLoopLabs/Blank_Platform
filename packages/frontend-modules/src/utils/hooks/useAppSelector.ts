import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

/**
 * Фабрика типизированного useSelector. Передайте тип RootState.
 */
export const createUseAppSelector = <State>(): TypedUseSelectorHook<State> =>
  useSelector as TypedUseSelectorHook<State>
