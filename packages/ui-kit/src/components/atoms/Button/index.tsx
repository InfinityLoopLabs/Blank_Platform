import type {
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
} from 'react'

import { clsx } from '@infinityloop.labs/utils'

type ButtonAnimationType = 'default' | 'active'
type ButtonSizeType = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
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
    color?: ButtonColorType
    size?: ButtonSizeType
  }
>

const sizeClassDictionary: Record<ButtonSizeType, string> = {
  default: 'h-9 px-4 py-2 text-sm has-[>svg]:px-3',
  sm: 'h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2.5',
  lg: 'h-10 px-6 text-sm has-[>svg]:px-4',
  icon: 'size-9 p-0',
  'icon-sm': 'size-8 p-0',
  'icon-lg': 'size-10 p-0',
}

const colorClassDictionary: Record<ButtonColorType, string> = {
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
  color = 'chart-1',
  size = 'default',
  className,
  children,
  style,
  ...property
}: ButtonPropertyType) => {
  const resolvedLeftIcon = leftIcon ?? icon
  const isDecorated = color === 'chart-1'
  const glowColor = glowColorByButtonColor[color]
  const resolvedStyle = {
    '--button-glow-color': glowColor,
    ...style,
  } as CSSProperties

  return (
    <button
      onClick={onClick}
      data-animation={animation}
      data-color={color}
      style={resolvedStyle}
      className={clsx(
        'group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-(--radius) font-medium',
        'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-(--card)',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeClassDictionary[size],
        colorClassDictionary[color],
        animation === 'active' && 'pulse-ring',
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

      {resolvedLeftIcon ? <span className="relative z-10">{resolvedLeftIcon}</span> : null}
      {children ? <span className="relative z-10">{children}</span> : null}
      {rightIcon ? <span className="relative z-10">{rightIcon}</span> : null}
    </button>
  )
}
