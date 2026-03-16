import React, {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from 'react'
import { clsx } from '@infinityloop.labs/utils'

export type TypographyType =
  | 'Heading'
  | 'SectionHeader'
  | 'CompactHeader'
  | 'Action'
  | 'Subheader'
  | 'Body'
  | 'BodySmall'
  | 'Caption'
  | 'CompactCaption'

export const TYPOGRAPHY_COLOR_OPTIONS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'muted-foreground',
  'muted',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'constructive',
  'constructive-foreground',
  'cautionary',
  'cautionary-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
] as const

export type TypographyColorType = (typeof TYPOGRAPHY_COLOR_OPTIONS)[number]

const typographyToTailwindClass: Record<TypographyType, string> = {
  Heading: 'text-xl md:text-2xl font-semibold tracking-tight',
  SectionHeader: 'text-lg font-semibold tracking-tight',
  CompactHeader: 'text-base font-semibold tracking-tight',
  Action: 'text-sm font-medium',
  Subheader: 'text-base md:text-sm',
  Body: 'text-sm leading-relaxed',
  BodySmall: 'text-sm leading-relaxed',
  Caption: 'text-xs uppercase tracking-[0.08em]',
  CompactCaption: 'text-xs',
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

const defaultElementTagByTypographyDictionary = {
  Heading: 'h1',
  SectionHeader: 'h4',
  CompactHeader: 'h5',
  Action: 'span',
  Subheader: 'p',
  Body: 'p',
  BodySmall: 'p',
  Caption: 'p',
  CompactCaption: 'p',
} as const satisfies Record<TypographyType, keyof HTMLElementTagNameMap>

const defaultColorByTypographyDictionary = {
  Heading: 'foreground',
  SectionHeader: 'foreground',
  CompactHeader: 'foreground',
  Action: 'foreground',
  Subheader: 'muted-foreground',
  Body: 'foreground',
  BodySmall: 'muted-foreground',
  Caption: 'muted-foreground',
  CompactCaption: 'muted-foreground',
} as const satisfies Record<TypographyType, TypographyColorType>

export const getTypographyClassName = (typography: TypographyType) =>
  typographyToTailwindClass[typography]

export const getDefaultElementTagByTypography = (typography: TypographyType) =>
  defaultElementTagByTypographyDictionary[typography]

export const getDefaultColorByTypography = (typography: TypographyType) =>
  defaultColorByTypographyDictionary[typography]

export const getPlaceholderTypographyClassName = (typography: TypographyType) =>
  placeholderTypographyToTailwindClass[typography] ?? ''

type OwnPropertyType = {
  typography: TypographyType
  element?: ElementType
  color?: TypographyColorType
  className?: string
  isLoading?: boolean
} & HTMLAttributes<HTMLElement>

export const Typography = ({
  typography,
  element,
  color,
  style,
  className: clsname = '',
  isLoading = false,
  children,
  ...props
}: OwnPropertyType) => {
  const resolvedElement =
    element ?? getDefaultElementTagByTypography(typography)
  const resolvedColor = color ?? getDefaultColorByTypography(typography)
  const resolvedContent = isLoading ? '\u00A0' : children
  const resolvedStyle = {
    color: `var(--${resolvedColor})`,
    ...style,
  } as CSSProperties

  const className = clsx(
    'font-infinityloop',
    getTypographyClassName(typography),
    isLoading && 'relative overflow-hidden rounded-(--radius)',
    clsname,
  )

  return React.createElement(
    resolvedElement,
    {
      className,
      style: resolvedStyle,
      'aria-busy': isLoading || undefined,
      ...props,
    },
    <>
      <span
        className={clsx('relative z-10', isLoading && 'loading-text-blink')}>
        {resolvedContent}
      </span>
      {isLoading ? (
        <span
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute inset-0 rounded-[inherit]',
            'loading-wave-overlay',
            'loading-wave',
          )}
        />
      ) : null}
    </>,
  )
}

Typography.displayName = 'Typography'
