import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

/**
 * The useEffectWithoutFirstCall function is a custom hook that allows you to run an effect
 * only after the first render. This is useful if you want to perform some side effect, but
 * don't want it to happen on the initial render. For example, if you wanted to fetch data from
 * an API when a component mounts, but not on the initial mount (because it's already been fetched),
 * then this hook would be helpful. It works by using useRef and checking whether we've mounted yet. If we have mounted before (i.e., this isn't our first call), then we return our effect
 *
 * @example useEffectWithoutFirstCall(() => {}, []);
 *
 * @param effect EffectCallback Define the effect that will be run
 * @param deps DependencyList Specify a list of dependencies
 *
 * @return A function that can be used
 *
 */
export const useEffectWithoutFirstCall = (
  effect: EffectCallback,
  deps?: DependencyList,
) => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      return effect()
    }
    isMounted.current = true
  }, deps)
}
