import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react'

import { clsx } from '@infinityloop.labs/utils'

const paperStyleDictionary = {
  light: 'bg-(--card)',
  dark: 'bg-(--background)',
} as const

type PaperType = keyof typeof paperStyleDictionary

type PaperBasePropertyType<T extends ElementType> = {
  as?: T
  type?: PaperType
  className?: string
  isColored?: boolean
}

type PaperPropertyType<T extends ElementType> = PropsWithChildren<
  PaperBasePropertyType<T> &
    Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>
>

const defaultElement = 'div'

export const Paper = <T extends ElementType = typeof defaultElement>({
  as,
  type = 'dark',
  className,
  children,
  isColored,
  ...property
}: PaperPropertyType<T>) => {
  const Component = (as || defaultElement) as ElementType
  const coloredClassName =
    'flat-paper--colored border border-(--primary) rounded-sm transition-colors'
  const resolvedBackgroundClass = isColored
    ? coloredClassName
    : clsx('border-(--border)', paperStyleDictionary[type])

  return (
    <Component
      className={clsx(
        'rounded-(--radius) border px-6 py-4 ',
        resolvedBackgroundClass,
        className,
      )}
      {...property}>
      {children}
    </Component>
  )
}
