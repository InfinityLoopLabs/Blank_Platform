import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react'
import { clsx } from '@infinityloop.labs/utils'

const flatPaperStyleDictionary = {
  light: 'bg-(--card)',
  dark: 'bg-(--background)',
} as const

type FlatPaperType = keyof typeof flatPaperStyleDictionary

type FlatPaperBasePropertyType<T extends ElementType> = {
  as?: T
  type?: FlatPaperType
  className?: string
  isColored?: boolean
}

type FlatPaperPropertyType<T extends ElementType> = PropsWithChildren<
  FlatPaperBasePropertyType<T> &
    Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>
>

const defaultElement = 'div'

export const FlatPaper = <T extends ElementType = typeof defaultElement>({
  as,
  type = 'dark',
  className,
  children,
  isColored,
  ...property
}: FlatPaperPropertyType<T>) => {
  const Component = (as || defaultElement) as ElementType
  const coloredClassName =
    'flat-paper--colored border border-(--shani-ember-dim) rounded-sm transition-colors'
  const resolvedBackgroundClass = isColored
    ? coloredClassName
    : clsx('border-(--border)', flatPaperStyleDictionary[type])

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
