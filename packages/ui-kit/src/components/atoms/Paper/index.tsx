import type {
  CSSProperties,
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

export type PaperType = keyof typeof paperStyleDictionary

export const PAPER_PATTERN_COLOR_OPTIONS = [
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
] as const
export type PaperPatternColorType = (typeof PAPER_PATTERN_COLOR_OPTIONS)[number]

const patternColorValueDictionary: Record<PaperPatternColorType, string> = {
  'chart-1': 'var(--chart-1)',
  'chart-2': 'var(--chart-2)',
  'chart-3': 'var(--chart-3)',
  'chart-4': 'var(--chart-4)',
  'chart-5': 'var(--chart-5)',
}

export type PaperBasePropertyType<T extends ElementType> = {
  as?: T
  type?: PaperType
  className?: string
  style?: CSSProperties
  isColored?: boolean
  isRoundedCornersDisabled?: boolean
  isLoading?: boolean
  patternIcon?: string
  patternColor?: PaperPatternColorType
  patternAngle?: number
  patternSize?: number | string
  patternOpacity?: number
}

export type PaperPropertyType<T extends ElementType = 'div'> =
  PropsWithChildren<
    PaperBasePropertyType<T> &
      Omit<
        ComponentPropsWithoutRef<T>,
        'as' | 'className' | 'children' | 'style'
      >
  >

const defaultElement = 'div'
const defaultPatternSize = 28
const defaultPatternOpacity = 0.14

const resolvePatternImage = (patternIcon: string): string => {
  const trimmedPatternIcon = patternIcon.trim()
  if (!trimmedPatternIcon) {
    return ''
  }

  if (trimmedPatternIcon.startsWith('url(')) {
    return trimmedPatternIcon
  }

  if (trimmedPatternIcon.startsWith('<svg')) {
    return `url("data:image/svg+xml,${encodeURIComponent(trimmedPatternIcon)}")`
  }

  return `url("${trimmedPatternIcon}")`
}

const resolvePatternSize = (patternSize: number | string): string =>
  typeof patternSize === 'number' ? `${patternSize}px` : patternSize

export const Paper = <T extends ElementType = typeof defaultElement>({
  as,
  type = 'dark',
  className,
  style,
  children,
  isColored,
  isRoundedCornersDisabled = false,
  isLoading = false,
  patternIcon,
  patternColor,
  patternAngle = 0,
  patternSize = defaultPatternSize,
  patternOpacity = defaultPatternOpacity,
  ...property
}: PaperPropertyType<T>) => {
  const Component = (as || defaultElement) as ElementType
  const isPatternEnabled = Boolean(patternIcon?.trim())
  const hasPatternRotation = Boolean(patternAngle)
  const resolvedPatternColor = patternColor
    ? patternColorValueDictionary[patternColor]
    : undefined
  const isMaskPatternEnabled = Boolean(resolvedPatternColor)
  const clampedPatternOpacity = Math.min(Math.max(patternOpacity, 0), 1)
  const resolvedPatternSize = resolvePatternSize(patternSize)
  const resolvedPatternImage = resolvePatternImage(patternIcon || '')
  const patternLayerStyle: CSSProperties | undefined = isPatternEnabled
    ? {
        ...(isMaskPatternEnabled
          ? {
              backgroundColor: resolvedPatternColor,
              WebkitMaskImage: resolvedPatternImage,
              maskImage: resolvedPatternImage,
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskRepeat: 'repeat',
              maskRepeat: 'repeat',
              WebkitMaskSize: `${resolvedPatternSize} ${resolvedPatternSize}`,
              maskSize: `${resolvedPatternSize} ${resolvedPatternSize}`,
            }
          : {
              backgroundImage: resolvedPatternImage,
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat',
              backgroundSize: `${resolvedPatternSize} ${resolvedPatternSize}`,
            }),
        borderRadius: 'inherit',
        opacity: clampedPatternOpacity,
        transform: hasPatternRotation
          ? `rotate(${patternAngle}deg)`
          : undefined,
        transformOrigin: 'center',
        ...(hasPatternRotation
          ? {
              inset: '-50%',
              width: '200%',
              height: '200%',
            }
          : { inset: 0 }),
      }
    : undefined
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
        (isLoading || isPatternEnabled) && 'relative',
        (isLoading || (isPatternEnabled && hasPatternRotation)) &&
          'overflow-hidden',
        resolvedBackgroundClass,
        className,
      )}
      style={style}
      {...property}>
      {isPatternEnabled ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={patternLayerStyle}
        />
      ) : null}
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
