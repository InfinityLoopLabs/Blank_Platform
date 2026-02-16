import React, { type ReactNode } from 'react'
import { clsx } from '@infinityloop.labs/utils'

type GlowingButtonPropertyType = {
  icon?: ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void

  isPulseRingEnabled?: boolean
  isFullWidth?: boolean
  className?: string
}

export const GlowingButton: FC<GlowingButtonPropertyType> = ({
  icon,
  onClick,
  isPulseRingEnabled = false,
  isFullWidth = false,
  className,
  children,
}) => (
  <>
    <button
      onClick={onClick}
      className={clsx(
        'group flex items-center justify-center gap-2 px-6 py-3',
        'bg-(--neon-main) text-(--background) rounded-(--radius) font-medium',
        'hover:bg-(--neon-main-bright) transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-(--neon-main) focus:ring-offset-2 focus:ring-offset-(--card)',
        'relative overflow-hidden cursor-pointer',
        'hover:scale-[1.02] active:scale-[0.98]',
        isFullWidth && 'w-full',
        isPulseRingEnabled && 'neon-pulse-ring',
        className,
      )}>
      {/* Cyberpunk scan line effect: Начало */}
      <div
        className={clsx(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          'bg-gradient-to-b from-transparent via-(--neon-main)/10 to-transparent',
          'pointer-events-none',
        )}
        style={{
          animation: 'scan-button 2s linear infinite',
        }}
      />
      {/* Cyberpunk scan line effect: Конец */}

      {/* Corner accents: Начало */}
      <div
        className={clsx(
          'absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-(--neon-main)',
          'opacity-0 group-hover:opacity-100 transition-all duration-300',
          'group-hover:w-4 group-hover:h-4',
        )}
      />
      <div
        className={clsx(
          'absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-(--neon-main)',
          'opacity-0 group-hover:opacity-100 transition-all duration-300',
          'group-hover:w-4 group-hover:h-4',
        )}
      />
      <div
        className={clsx(
          'absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-(--neon-main)',
          'opacity-0 group-hover:opacity-100 transition-all duration-300',
          'group-hover:w-4 group-hover:h-4',
        )}
      />
      <div
        className={clsx(
          'absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-(--neon-main)',
          'opacity-0 group-hover:opacity-100 transition-all duration-300',
          'group-hover:w-4 group-hover:h-4',
        )}
      />
      {/* Corner accents: Конец */}

      {/* Neon pulse overlay: Начало */}
      <div
        className={clsx(
          'absolute inset-0 bg-gradient-to-r from-(--neon-main)/0 via-(--neon-main)/5 to-(--neon-main)/0',
          'opacity-0 group-hover:opacity-100 pointer-events-none',
          'transition-opacity duration-500',
        )}
        style={{
          animation: 'pulse-button 2s ease-in-out infinite',
        }}
      />
      {/* Neon pulse overlay: Конец */}

      {/* Shimmer effect: Начало */}
      {/* {isShimmerEnabled && (*/}
      {/*  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-animate" />*/}
      {/* )}*/}
      {/* Shimmer effect: Конец */}

      {/* Button content: Начало */}
      {icon && <div className="relative z-10">{icon}</div>}
      <span className="relative z-10">{children}</span>
      {/* Button content: Конец */}
    </button>
  </>
)
