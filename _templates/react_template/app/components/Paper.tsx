import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '../lib/utils'

type PapperPropertyType = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    accentColor?: string
    borderColor?: string
    backgroundColor?: string
    cornerSize?: number
  }
>

export const Paper: FC<PapperPropertyType> = ({
  children,
  className,
  accentColor = 'var(--neon-main-bright)',
  borderColor = 'var(--neon-main)',
  backgroundColor = 'var(--card)',
  cornerSize = 32,
  style,
  ...property
}) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-xl border-2 neon-glow',
      'bg-[var(--card)] text-foreground',
      'shadow-[0_0_20px_rgba(255,128,0,0.25)] backdrop-blur-sm',
      className,
    )}
    style={{
      borderColor,
      backgroundColor,
      ...style,
    }}
    {...property}>
    <div className="pointer-events-none absolute inset-0 " />
    <div className="pointer-events-none absolute inset-0 bg-]" />

    <div className="relative z-10 p-6">{children}</div>
  </div>
)
