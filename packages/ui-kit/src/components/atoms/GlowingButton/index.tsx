import type { ButtonHTMLAttributes, MouseEvent, PropsWithChildren, ReactNode } from 'react'

import { clsx } from '@infinityloop.labs/utils'

type GlowingButtonStateType = 'default' | 'active'

type GlowingButtonPropertyType = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
    state?: GlowingButtonStateType
    isFullWidth?: boolean
  }
>

export const GlowingButton = ({
  icon,
  leftIcon,
  rightIcon,
  onClick,
  state = 'default',
  isFullWidth = false,
  className,
  children,
  ...property
}: GlowingButtonPropertyType) => {
  const resolvedLeftIcon = leftIcon ?? icon

  return (
    <button
      onClick={onClick}
      data-state={state}
      className={clsx(
        'group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden px-6 py-3',
        'rounded-(--radius) bg-(--neon-main) font-medium text-(--background)',
        'transition-all duration-300 hover:scale-[1.02] hover:bg-(--neon-main-bright) active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-(--neon-main) focus:ring-offset-2 focus:ring-offset-(--card)',
        isFullWidth && 'w-full',
        state === 'active' && 'neon-pulse-ring',
        className,
      )}
      {...property}>
      <div
        className={clsx(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          'bg-gradient-to-b from-transparent via-(--neon-main)/10 to-transparent',
        )}
        style={{ animation: 'scan-button 2s linear infinite' }}
      />

      <div
        className={clsx(
          'absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-(--neon-main)',
          'opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100',
        )}
      />
      <div
        className={clsx(
          'absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-(--neon-main)',
          'opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100',
        )}
      />
      <div
        className={clsx(
          'absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-(--neon-main)',
          'opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100',
        )}
      />
      <div
        className={clsx(
          'absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-(--neon-main)',
          'opacity-0 transition-all duration-300 group-hover:h-4 group-hover:w-4 group-hover:opacity-100',
        )}
      />

      <div
        className={clsx(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          'bg-gradient-to-r from-(--neon-main)/0 via-(--neon-main)/5 to-(--neon-main)/0',
        )}
        style={{ animation: 'pulse-button 2s ease-in-out infinite' }}
      />

      {resolvedLeftIcon ? <span className="relative z-10">{resolvedLeftIcon}</span> : null}
      <span className="relative z-10">{children}</span>
      {rightIcon ? <span className="relative z-10">{rightIcon}</span> : null}
    </button>
  )
}
