import type { ButtonHTMLAttributes, MouseEvent, PropsWithChildren, ReactNode } from 'react'

import { clsx } from '@infinityloop.labs/utils'

type ButtonStateType = 'default' | 'active'
type ButtonVariantType =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
type ButtonSizeType = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

type ButtonPropertyType = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
    state?: ButtonStateType
    variant?: ButtonVariantType
    size?: ButtonSizeType
    isGlow?: boolean
    isFullWidth?: boolean
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

const variantClassDictionary: Record<ButtonVariantType, string> = {
  default: 'bg-(--chart-1) text-(--background) hover:brightness-110',
  destructive:
    'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
  outline:
    'border border-(--border) bg-(--card) text-(--foreground) hover:bg-(--muted)',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

export const Button = ({
  icon,
  leftIcon,
  rightIcon,
  onClick,
  state = 'default',
  variant = 'default',
  size = 'default',
  isGlow = false,
  isFullWidth = false,
  className,
  children,
  ...property
}: ButtonPropertyType) => {
  const resolvedState: ButtonStateType = state === 'active' || isGlow ? 'active' : 'default'
  const resolvedLeftIcon = leftIcon ?? icon
  const isDecorated = variant === 'default'

  return (
    <button
      onClick={onClick}
      data-state={resolvedState}
      data-variant={variant}
      className={clsx(
        'group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-(--radius) font-medium',
        'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-(--chart-1) focus:ring-offset-2 focus:ring-offset-(--card)',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeClassDictionary[size],
        variantClassDictionary[variant],
        isFullWidth && 'w-full',
        resolvedState === 'active' && variant === 'default' && 'pulse-ring',
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
