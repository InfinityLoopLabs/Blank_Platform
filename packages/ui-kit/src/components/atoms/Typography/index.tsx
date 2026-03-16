import React, { type ElementType, type HTMLAttributes } from 'react'
import { clsx } from '@infinityloop.labs/utils'

export type TypographyType = 'Heading' | 'Action' | 'Subheader' | 'Caption'

const typographyToTailwindClass: Record<TypographyType, string> = {
  Heading: 'text-lg font-semibold',
  Action: 'text-sm font-medium',
  Subheader: 'text-base md:text-sm text-muted-foreground',
  Caption: 'text-xs uppercase tracking-[0.08em] text-muted-foreground',
}

export const TYPOGRAPHY_OPTIONS = Object.keys(
  typographyToTailwindClass,
) as TypographyType[]

const placeholderTypographyToTailwindClass: Partial<
  Record<TypographyType, string>
> = {
  Subheader:
    'placeholder:text-base md:placeholder:text-sm placeholder:text-muted-foreground',
}

export const getTypographyClassName = (typography: TypographyType) =>
  typographyToTailwindClass[typography]

export const getPlaceholderTypographyClassName = (typography: TypographyType) =>
  placeholderTypographyToTailwindClass[typography] ?? ''

type OwnPropertyType = {
  typography: TypographyType
  element?: ElementType
  className?: string
  isLoading?: boolean
} & HTMLAttributes<HTMLElement>

export const Typography = ({
  typography,
  element = 'span',
  className: clsname = '',
  isLoading = false,
  children,
  ...props
}: OwnPropertyType) => {
  const className = clsx(
    'font-infinityloop',
    getTypographyClassName(typography),
    isLoading && 'relative overflow-hidden rounded-(--radius)',
    clsname,
  )

  return React.createElement(
    element,
    {
      className,
      'aria-busy': isLoading || undefined,
      ...props,
    },
    <>
      <span className={clsx('relative z-10', isLoading && 'loading-text-blink')}>
        {children}
      </span>
      {isLoading ? (
        <span
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute inset-0 rounded-[inherit]',
            'bg-gradient-to-r from-white/0 via-white/18 to-white/0 opacity-70',
            'loading-wave',
          )}
        />
      ) : null}
    </>,
  )
}

Typography.displayName = 'Typography'
