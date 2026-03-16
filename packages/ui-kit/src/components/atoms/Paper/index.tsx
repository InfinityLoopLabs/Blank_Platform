import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react'

import { clsx } from '@infinityloop.labs/utils'

const paperStyleDictionary = {
  light: 'bg-(--card)',
  dark: 'bg-(--background)',
  gradient:
    'bg-[radial-gradient(120%_120%_at_0%_0%,color-mix(in_oklab,var(--chart-1)_10%,transparent),transparent_55%),linear-gradient(180deg,color-mix(in_oklab,var(--card)_93%,black_7%),var(--card))]',
} as const

type PaperType = keyof typeof paperStyleDictionary

type PaperBasePropertyType<T extends ElementType> = {
  as?: T
  type?: PaperType
  className?: string
  isColored?: boolean
  isRoundedCornersDisabled?: boolean
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
  isRoundedCornersDisabled = false,
  isLoading = false,
  ...property
}: PaperPropertyType<T>) => {
  const Component = (as || defaultElement) as ElementType
  const roundedClassName = isRoundedCornersDisabled
    ? 'rounded-none'
    : 'rounded-(--radius)'
  const coloredClassName =
    'paper--colored border border-(--chart-1) bg-(--card) transition-colors'
  const resolvedBackgroundClass = isColored
    ? clsx(coloredClassName, roundedClassName)
    : clsx('border-(--border)', paperStyleDictionary[type])

  return (
    <Component
      aria-busy={isLoading || undefined}
      className={clsx(
        'border px-6 py-4',
        roundedClassName,
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
            'loading-wave-overlay',
            'loading-wave',
          )}
        />
      ) : null}
    </Component>
  )
}
