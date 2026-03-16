import type {
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
} from 'react'

import { clsx } from '@infinityloop.labs/utils'
import { LoaderCircle } from 'lucide-react'
import { getTypographyClassName } from '@/components/atoms/Typography'

type ButtonAnimationType = 'default' | 'active' | 'loading'
type ButtonSizeType =
  | 's'
  | 'm'
  | 'l'
  | 'icon-s'
  | 'icon-m'
  | 'icon-l'
  | 'default'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-sm'
  | 'icon-lg'
  | 'icon-circle'
export const BUTTON_VARIANT_OPTIONS = ['filled', 'outline', 'text'] as const
export type ButtonVariantType = (typeof BUTTON_VARIANT_OPTIONS)[number]
export const BUTTON_COLOR_OPTIONS = [
  'primary',
  'secondary',
  'accent',
  'muted',
  'constructive',
  'cautionary',
  'destructive',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
] as const
export type ButtonColorType = (typeof BUTTON_COLOR_OPTIONS)[number]

type ButtonPropertyType = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
    animation?: ButtonAnimationType
    isLoading?: boolean
    color?: ButtonColorType
    variant?: ButtonVariantType
    size?: ButtonSizeType
  }
>

const sizeClassDictionary: Record<ButtonSizeType, string> = {
  s: 'h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5',
  m: 'h-9 px-4 py-2 text-sm has-[>svg]:px-3',
  l: 'h-10 px-6 text-sm has-[>svg]:px-4',
  'icon-s': 'size-8 p-0',
  'icon-m': 'size-9 p-0',
  'icon-l': 'size-10 p-0',
  default: 'h-9 px-4 py-2 text-sm has-[>svg]:px-3',
  sm: 'h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5',
  lg: 'h-10 px-6 text-sm has-[>svg]:px-4',
  icon: 'size-9 p-0',
  'icon-sm': 'size-8 p-0',
  'icon-lg': 'size-10 p-0',
  'icon-circle': 'size-9 rounded-full p-0',
}

const loadingIconSizeClassDictionary: Record<ButtonSizeType, string> = {
  s: 'size-[14px]',
  m: 'size-4',
  l: 'size-[18px]',
  'icon-s': 'size-[14px]',
  'icon-m': 'size-4',
  'icon-l': 'size-[18px]',
  default: 'size-4',
  sm: 'size-[14px]',
  lg: 'size-[18px]',
  icon: 'size-4',
  'icon-sm': 'size-[14px]',
  'icon-lg': 'size-[18px]',
  'icon-circle': 'size-4',
}

const filledColorClassDictionary: Record<ButtonColorType, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/60',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/85 focus:ring-secondary/60',
  accent: 'bg-accent text-accent-foreground hover:bg-accent/85 focus:ring-accent/60',
  muted: 'bg-muted text-foreground hover:bg-muted/85 focus:ring-ring/60',
  constructive:
    'bg-constructive text-constructive-foreground hover:bg-constructive/90 focus:ring-constructive/45',
  cautionary:
    'bg-cautionary text-cautionary-foreground hover:bg-cautionary/90 focus:ring-cautionary/45',
  destructive:
    'bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive/45',
  'chart-1': 'bg-(--chart-1) text-black hover:brightness-110 focus:ring-(--chart-1)',
  'chart-2': 'bg-(--chart-2) text-black hover:brightness-110 focus:ring-(--chart-2)',
  'chart-3': 'bg-(--chart-3) text-white hover:brightness-110 focus:ring-(--chart-3)',
  'chart-4': 'bg-(--chart-4) text-black hover:brightness-110 focus:ring-(--chart-4)',
  'chart-5': 'bg-(--chart-5) text-black hover:brightness-110 focus:ring-(--chart-5)',
}

const outlineColorClassDictionary: Record<ButtonColorType, string> = {
  primary: 'border border-primary bg-transparent text-primary hover:bg-primary/10 focus:ring-primary/60',
  secondary:
    'border border-secondary bg-transparent text-secondary hover:bg-secondary/30 focus:ring-secondary/60',
  accent: 'border border-accent bg-transparent text-accent hover:bg-accent/30 focus:ring-accent/60',
  muted: 'border border-muted bg-transparent text-muted hover:bg-muted/50 focus:ring-ring/60',
  constructive:
    'border border-constructive bg-transparent text-constructive hover:bg-constructive/10 focus:ring-constructive/45',
  cautionary:
    'border border-cautionary bg-transparent text-cautionary hover:bg-cautionary/20 focus:ring-cautionary/45',
  destructive:
    'border border-destructive bg-transparent text-destructive hover:bg-destructive/10 focus:ring-destructive/45',
  'chart-1':
    'border border-(--chart-1) bg-transparent text-(--chart-1) hover:bg-(--chart-1)/10 focus:ring-(--chart-1)',
  'chart-2':
    'border border-(--chart-2) bg-transparent text-(--chart-2) hover:bg-(--chart-2)/10 focus:ring-(--chart-2)',
  'chart-3':
    'border border-(--chart-3) bg-transparent text-(--chart-3) hover:bg-(--chart-3)/10 focus:ring-(--chart-3)',
  'chart-4':
    'border border-(--chart-4) bg-transparent text-(--chart-4) hover:bg-(--chart-4)/10 focus:ring-(--chart-4)',
  'chart-5':
    'border border-(--chart-5) bg-transparent text-(--chart-5) hover:bg-(--chart-5)/10 focus:ring-(--chart-5)',
}

const textColorClassDictionary: Record<ButtonColorType, string> = {
  primary: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary/60',
  secondary: 'bg-transparent text-secondary hover:bg-secondary/30 focus:ring-secondary/60',
  accent: 'bg-transparent text-accent hover:bg-accent/30 focus:ring-accent/60',
  muted: 'bg-transparent text-muted hover:bg-muted/50 focus:ring-ring/60',
  constructive: 'bg-transparent text-constructive hover:bg-constructive/10 focus:ring-constructive/45',
  cautionary: 'bg-transparent text-cautionary hover:bg-cautionary/20 focus:ring-cautionary/45',
  destructive: 'bg-transparent text-destructive hover:bg-destructive/10 focus:ring-destructive/45',
  'chart-1': 'bg-transparent text-(--chart-1) hover:bg-(--chart-1)/10 focus:ring-(--chart-1)',
  'chart-2': 'bg-transparent text-(--chart-2) hover:bg-(--chart-2)/10 focus:ring-(--chart-2)',
  'chart-3': 'bg-transparent text-(--chart-3) hover:bg-(--chart-3)/10 focus:ring-(--chart-3)',
  'chart-4': 'bg-transparent text-(--chart-4) hover:bg-(--chart-4)/10 focus:ring-(--chart-4)',
  'chart-5': 'bg-transparent text-(--chart-5) hover:bg-(--chart-5)/10 focus:ring-(--chart-5)',
}

const colorClassByVariantDictionary: Record<ButtonVariantType, Record<ButtonColorType, string>> = {
  filled: filledColorClassDictionary,
  outline: outlineColorClassDictionary,
  text: textColorClassDictionary,
}

const glowColorByButtonColor: Record<ButtonColorType, string> = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  accent: 'var(--accent)',
  muted: 'var(--muted)',
  constructive: 'var(--constructive)',
  cautionary: 'var(--cautionary)',
  destructive: 'var(--destructive)',
  'chart-1': 'var(--chart-1)',
  'chart-2': 'var(--chart-2)',
  'chart-3': 'var(--chart-3)',
  'chart-4': 'var(--chart-4)',
  'chart-5': 'var(--chart-5)',
}

export const Button = ({
  icon,
  leftIcon,
  rightIcon,
  onClick,
  animation = 'default',
  isLoading = false,
  color = 'chart-1',
  variant = 'filled',
  size = 'm',
  className,
  children,
  style,
  ...property
}: ButtonPropertyType) => {
  const resolvedLeftIcon = leftIcon ?? icon
  const isLoadingState = isLoading || animation === 'loading'
  const isDecorated = color === 'chart-1' && variant === 'filled' && !isLoadingState
  const hasLeftIcon = Boolean(resolvedLeftIcon)
  const hasRightIcon = Boolean(rightIcon)
  const shouldShowLeftLoadingIcon = isLoadingState && hasLeftIcon
  const shouldShowRightLoadingIcon = isLoadingState && hasRightIcon
  const shouldShowCenterLoadingIcon =
    isLoadingState && !shouldShowLeftLoadingIcon && !shouldShowRightLoadingIcon
  const glowColor = glowColorByButtonColor[color]
  const resolvedStyle = {
    '--button-glow-color': glowColor,
    ...style,
  } as CSSProperties
  const loadingIconClassName = clsx(
    loadingIconSizeClassDictionary[size],
    'animate-spin text-current/70',
  )

  return (
    <button
      onClick={onClick}
      data-animation={isLoadingState ? 'loading' : animation}
      data-color={color}
      data-variant={variant}
      aria-busy={isLoadingState || undefined}
      style={resolvedStyle}
      className={clsx(
        'group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-(--radius) font-medium',
        'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-(--card)',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeClassDictionary[size],
        colorClassByVariantDictionary[variant][color],
        animation === 'active' && !isLoadingState && 'pulse-ring',
        isLoadingState && 'cursor-progress',
        className,
      )}
      {...property}>
      {isDecorated ? (
        <>
          <div
            className={clsx(
              'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              'bg-gradient-to-b from-transparent via-(--chart-1)/10 to-transparent',
            )}
            style={{ animation: 'scan-button 2s linear infinite' }}
          />
          <div
            className={clsx(
              'absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-(--chart-1)',
              'opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100',
            )}
          />
          <div
            className={clsx(
              'absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-(--chart-1)',
              'opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100',
            )}
          />
          <div
            className={clsx(
              'absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-(--chart-1)',
              'opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100',
            )}
          />
          <div
            className={clsx(
              'absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-(--chart-1)',
              'opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100',
            )}
          />
          <div
            className={clsx(
              'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
              'bg-gradient-to-r from-(--chart-1)/0 via-(--chart-1)/5 to-(--chart-1)/0',
            )}
            style={{ animation: 'pulse-button 2s ease-in-out infinite' }}
          />
        </>
      ) : null}
      {isLoadingState ? (
        <div
          aria-hidden="true"
          className={clsx(
            'pointer-events-none absolute inset-0 rounded-[inherit]',
            'loading-wave-overlay',
            'loading-wave',
          )}
        />
      ) : null}

      {hasLeftIcon ? (
        <span className="relative z-10 inline-flex items-center justify-center">
          {shouldShowLeftLoadingIcon ? (
            <LoaderCircle aria-hidden="true" className={loadingIconClassName} />
          ) : (
            resolvedLeftIcon
          )}
        </span>
      ) : null}

      {children ? (
        <span
          className={clsx(
            'relative z-10',
            getTypographyClassName('Action'),
            shouldShowCenterLoadingIcon && 'opacity-0',
          )}>
          {children}
        </span>
      ) : null}

      {hasRightIcon ? (
        <span className="relative z-10 inline-flex items-center justify-center">
          {shouldShowRightLoadingIcon ? (
            <LoaderCircle aria-hidden="true" className={loadingIconClassName} />
          ) : (
            rightIcon
          )}
        </span>
      ) : null}

      {shouldShowCenterLoadingIcon ? (
        <span className="pointer-events-none absolute inset-0 z-20 inline-flex items-center justify-center">
          <LoaderCircle aria-hidden="true" className={loadingIconClassName} />
          <span className="sr-only">Loading</span>
        </span>
      ) : null}
    </button>
  )
}
