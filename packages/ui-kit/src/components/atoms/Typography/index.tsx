import React, { type ElementType, type HTMLAttributes } from 'react'
import { clsx } from '@infinityloop.labs/utils'

export type TypographyType = 'Action' | 'Subheader' | 'Caption'

const typographyToTailwindClass: Record<TypographyType, string> = {
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
} & HTMLAttributes<HTMLElement>

export const Typography = ({
  typography,
  element = 'span',
  className: clsname = '',
  children,
  ...props
}: OwnPropertyType) => {
  const className = clsx(
    'font-infinityloop',
    getTypographyClassName(typography),
    clsname,
  )

  return React.createElement(
    element,
    {
      className,
      ...props,
    },
    children,
  )
}

Typography.displayName = 'Typography'
