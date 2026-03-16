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
  isLoading?: boolean
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
  isLoading = false,
  ...property
}: PaperPropertyType<T>) => {
  const Component = (as || defaultElement) as ElementType
  const coloredClassName =
    'paper--colored border border-(--border) rounded-sm bg-(--card) transition-colors'
  const resolvedBackgroundClass = isColored
    ? coloredClassName
    : clsx('border-(--border)', paperStyleDictionary[type])

  return (
    <Component
      aria-busy={isLoading || undefined}
      className={clsx(
        'rounded-(--radius) border px-6 py-4',
        isLoading && 'relative overflow-hidden',
        resolvedBackgroundClass,
        className,
      )}
      {...property}>
      {children}
      {isLoading ? (
        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute inset-0 rounded-[inherit]',
            'bg-gradient-to-r from-white/0 via-white/18 to-white/0 opacity-70',
            'loading-wave',
          )}
        />
      ) : null}
    </Component>
  )
}
