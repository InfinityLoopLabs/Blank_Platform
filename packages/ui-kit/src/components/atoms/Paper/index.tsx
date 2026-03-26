import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
  ReactElement,
} from 'react'
import { createElement, isValidElement } from 'react'
import { clsx } from '@infinityloop.labs/utils'
import { renderToStaticMarkup } from 'react-dom/server'

import { GLASS_CLASS } from '@/constants'

const paperStyleDictionary = {
  light: 'bg-(--card)',
  dark: 'bg-(--background)',
  glass: `${GLASS_CLASS} bg-transparent`,
  transparent: 'bg-transparent',
} as const

export type PaperType = keyof typeof paperStyleDictionary

const paperGradientClassName =
  'bg-[radial-gradient(120%_120%_at_0%_0%,color-mix(in_oklab,var(--chart-1)_10%,transparent),transparent_55%),linear-gradient(180deg,color-mix(in_oklab,var(--card)_93%,black_7%),var(--card))]'

export const PAPER_RADIUS_CLASS_OPTIONS = [
  'rounded-none',
  'rounded-sm',
  'rounded-md',
  'rounded-lg',
  'rounded-xl',
  'rounded-2xl',
  'rounded-3xl',
  'rounded-full',
  'rounded-(--radius)',
] as const
export type PaperRadiusClassType = (typeof PAPER_RADIUS_CLASS_OPTIONS)[number]

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
  isGradientEnabled?: boolean
  isBorderDisabled?: boolean
  isPaddingDisabled?: boolean
  radiusClassName?: PaperRadiusClassType
  isRoundedCornersDisabled?: boolean
  isLoading?: boolean
  patternIconComponent?: ElementType | ReactElement
  patternIconFile?: string
  patternColor?: PaperPatternColorType
  patternAngle?: number
  patternSize?: number | string
  patternGap?: number
  patternOpacity?: number
  isPatternFixed?: boolean
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
const defaultPatternGap = 0
const defaultPatternOpacity = 0.14

const resolvePatternImageFromFile = (patternIconFile: string): string => {
  const trimmedPatternIconFile = patternIconFile.trim()
  if (!trimmedPatternIconFile) {
    return ''
  }

  if (trimmedPatternIconFile.startsWith('url(')) {
    return trimmedPatternIconFile
  }

  return `url("${trimmedPatternIconFile}")`
}

const resolvePatternIconFromComponent = (
  patternIconComponent?: ElementType | ReactElement,
  patternAngle = 0,
  patternGap = defaultPatternGap,
): string => {
  if (!patternIconComponent) {
    return ''
  }

  const iconElement = isValidElement(patternIconComponent)
    ? patternIconComponent
    : createElement(patternIconComponent, {
        width: 24,
        height: 24,
        strokeWidth: 2,
      })

  const renderedSvg = renderToStaticMarkup(iconElement).trim()
  if (!renderedSvg) {
    return ''
  }

  const viewBoxMatch = renderedSvg.match(/viewBox="([^"]+)"/)
  const viewBoxParts =
    viewBoxMatch?.[1]?.split(/\s+/).map(Number).filter(Number.isFinite) || []
  const [, , viewBoxWidth = 24, viewBoxHeight = 24] = viewBoxParts
  const rootTagMatch = renderedSvg.match(/^<svg([^>]*)>/)
  const rootAttributes = rootTagMatch?.[1] || ''
  const sanitizedRootAttributes = rootAttributes.replace(
    /\s(?:xmlns|width|height|viewBox|class)="[^"]*"/g,
    '',
  )
  const innerMarkup = renderedSvg
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '')
  const normalizedPatternGap = Number.isFinite(patternGap)
    ? Math.max(0, patternGap)
    : 0
  const wrapperWidth = viewBoxWidth + normalizedPatternGap
  const wrapperHeight = viewBoxHeight + normalizedPatternGap
  const offset = normalizedPatternGap / 2
  const transformParts = [`translate(${offset} ${offset})`]

  if (patternAngle) {
    transformParts.push(
      `rotate(${patternAngle} ${viewBoxWidth / 2} ${viewBoxHeight / 2})`,
    )
  }

  const wrappedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${wrapperWidth}" height="${wrapperHeight}" viewBox="0 0 ${wrapperWidth} ${wrapperHeight}"${sanitizedRootAttributes}><g transform="${transformParts.join(' ')}">${innerMarkup}</g></svg>`

  return `url("data:image/svg+xml,${encodeURIComponent(wrappedSvg)}")`
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
  isGradientEnabled = false,
  isBorderDisabled = false,
  isPaddingDisabled = false,
  radiusClassName = 'rounded-(--radius)',
  isRoundedCornersDisabled = false,
  isLoading = false,
  patternIconComponent,
  patternIconFile = '',
  patternColor,
  patternAngle = 0,
  patternSize = defaultPatternSize,
  patternGap = defaultPatternGap,
  patternOpacity = defaultPatternOpacity,
  isPatternFixed = false,
  ...property
}: PaperPropertyType<T>) => {
  const Component = (as || defaultElement) as ElementType
  const resolvedPatternImage = patternIconComponent
    ? resolvePatternIconFromComponent(
        patternIconComponent,
        patternAngle,
        patternGap,
      )
    : resolvePatternImageFromFile(patternIconFile)
  const isPatternEnabled = Boolean(resolvedPatternImage)
  const hasPatternRotation = Boolean(patternAngle && !patternIconComponent)
  const resolvedPatternColor = patternColor
    ? patternColorValueDictionary[patternColor]
    : undefined
  const isMaskPatternEnabled = Boolean(resolvedPatternColor)
  const clampedPatternOpacity = Math.min(Math.max(patternOpacity, 0), 1)
  const resolvedPatternSize = resolvePatternSize(patternSize)
  const patternLayerStyle: CSSProperties | undefined = isPatternEnabled
    ? {
        ...(isMaskPatternEnabled
          ? {
              backgroundColor: resolvedPatternColor,
              WebkitMaskImage: resolvedPatternImage,
              maskImage: resolvedPatternImage,
              WebkitMaskPosition: '0 0',
              maskPosition: '0 0',
              WebkitMaskRepeat: 'repeat',
              maskRepeat: 'repeat',
              WebkitMaskAttachment: isPatternFixed ? 'fixed' : undefined,
              maskAttachment: isPatternFixed ? 'fixed' : undefined,
              WebkitMaskSize: `${resolvedPatternSize} ${resolvedPatternSize}`,
              maskSize: `${resolvedPatternSize} ${resolvedPatternSize}`,
            }
          : {
              backgroundImage: resolvedPatternImage,
              backgroundPosition: '0 0',
              backgroundRepeat: 'repeat',
              backgroundAttachment: isPatternFixed ? 'fixed' : undefined,
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
    : radiusClassName
  const isTransparentPaper = type === 'transparent' && !isColored
  const paddingClassName = isPaddingDisabled ? 'p-0' : 'px-6 py-4'
  const resolvedBackgroundClass = isColored
    ? 'paper--colored bg-(--card) transition-colors'
    : paperStyleDictionary[type]
  const borderColorClassName = isColored
    ? 'border-(--chart-1)'
    : 'border-(--border)'
  const borderClassName =
    isBorderDisabled || isTransparentPaper
      ? 'border-0'
      : clsx('border', borderColorClassName)

  return (
    <Component
      aria-busy={isLoading || undefined}
      className={clsx(
        borderClassName,
        paddingClassName,
        roundedClassName,
        (isLoading || isPatternEnabled) && 'relative',
        (isLoading || (isPatternEnabled && hasPatternRotation)) &&
          'overflow-hidden',
        resolvedBackgroundClass,
        isGradientEnabled && paperGradientClassName,
        className,
      )}
      style={style}
      {...property}>
      {isPatternEnabled ? (
        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none',
            isPatternFixed ? 'fixed inset-0' : 'absolute',
          )}
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
