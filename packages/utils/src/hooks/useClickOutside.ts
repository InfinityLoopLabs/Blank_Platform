import { MutableRefObject, useCallback, useEffect } from 'react'

/**
 * The useClickOutside function is a custom hook that allows you to detect clicks outside an element.
 *
 * @example useClickOutside(ref, ()=>{})
 * @param ref MutableRefObject Element | null Reference the element that we want to detect a click outside of
 * @param callback Function Pass a function that will be called when the user clicks outside the element
 *
 * @return Void
 *
 */
export const useClickOutside = (
  ref: MutableRefObject<Element | null>,
  callback: Function,
) => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref?.current && !ref.current?.contains(event.target as Node)) {
        callback(event)
      }
    },
    [ref?.current, callback],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])
}
