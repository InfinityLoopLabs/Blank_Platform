import React from 'react'
import type { CSSProperties, FC } from 'react'
import { clsx } from '@infinityloop.labs/utils'

export type BlockTooltipLocationType =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export type BlockTooltipVariantType = 'default' | 'warning' | 'info' | 'success'

type BlockTooltipPropertyType = {
  text: string
  title?: string
  location?: BlockTooltipLocationType
  variant?: BlockTooltipVariantType
  maxWidth?: number
  className?: string
  isPreview?: boolean
  showArrow?: boolean
  offset?: Partial<Record<'top' | 'bottom' | 'left' | 'right', string>>
}

const BLOCK_TOOLTIP_VARIANTS: Record<
  BlockTooltipVariantType,
  {
    border: string
    background: string
    glow: string
    accent: string
  }
> = {
  default: {
    border: 'var(--neon-main)',
    background: 'color-mix(in oklab, var(--card) 85%, transparent)',
    glow: 'var(--shani-glow)',
    accent: 'var(--neon-main-bright)',
  },
  warning: {
    border: 'var(--shani-ember)',
    background: 'color-mix(in oklab, var(--card) 82%, var(--shani-ember-dim))',
    glow: 'var(--shani-glow)',
    accent: 'var(--shani-ember)',
  },
  info: {
    border: 'var(--neon-main-dim)',
    background: 'color-mix(in oklab, var(--card) 88%, transparent)',
    glow: 'var(--shani-glow)',
    accent: 'var(--neon-main)',
  },
  success: {
    border: 'var(--neon-main)',
    background: 'color-mix(in oklab, var(--card) 84%, var(--shani-ember-soft))',
    glow: 'var(--shani-glow)',
    accent: 'var(--neon-main-bright)',
  },
}

const TOOLTIP_MARGIN_PX = 12

const POSITION_STYLES: Record<
  BlockTooltipLocationType,
  {
    tooltip: CSSProperties
    arrow: CSSProperties
  }
> = {
  top: {
    tooltip: {
      top: '0',
      left: '50%',
      transform: 'translate(-50%, -100%)',
      marginTop: `-${TOOLTIP_MARGIN_PX}px`,
    },
    arrow: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderTopWidth: 8,
      borderTopStyle: 'solid',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
    },
  },
  'top-left': {
    tooltip: {
      top: '0',
      left: '0',
      transform: 'translateY(-100%)',
      marginTop: `-${TOOLTIP_MARGIN_PX}px`,
    },
    arrow: {
      top: '100%',
      left: '12px',
      borderTopWidth: 8,
      borderTopStyle: 'solid',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
    },
  },
  'top-right': {
    tooltip: {
      top: '0',
      right: '0',
      transform: 'translateY(-100%)',
      marginTop: `-${TOOLTIP_MARGIN_PX}px`,
    },
    arrow: {
      top: '100%',
      right: '12px',
      borderTopWidth: 8,
      borderTopStyle: 'solid',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
    },
  },
  bottom: {
    tooltip: {
      bottom: '0',
      left: '50%',
      transform: 'translate(-50%, 100%)',
      marginBottom: `-${TOOLTIP_MARGIN_PX}px`,
    },
    arrow: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderBottomWidth: 8,
      borderBottomStyle: 'solid',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
    },
  },
  'bottom-left': {
    tooltip: {
      bottom: '0',
      left: '0',
      transform: 'translateY(100%)',
      marginBottom: `-${TOOLTIP_MARGIN_PX}px`,
    },
    arrow: {
      bottom: '100%',
      left: '12px',
      borderBottomWidth: 8,
      borderBottomStyle: 'solid',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
    },
  },
  'bottom-right': {
    tooltip: {
      bottom: '0',
      right: '0',
      transform: 'translateY(100%)',
      marginBottom: `-${TOOLTIP_MARGIN_PX}px`,
    },
    arrow: {
      bottom: '100%',
      right: '12px',
      borderBottomWidth: 8,
      borderBottomStyle: 'solid',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
    },
  },
  left: {
    tooltip: {
      left: '0',
      top: '50%',
      transform: 'translate(-100%, -50%)',
      marginLeft: `-${TOOLTIP_MARGIN_PX}px`,
    },
    arrow: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderLeftWidth: 8,
      borderLeftStyle: 'solid',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
    },
  },
  right: {
    tooltip: {
      right: '0',
      top: '50%',
      transform: 'translate(100%, -50%)',
      marginRight: `-${TOOLTIP_MARGIN_PX}px`,
    },
    arrow: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderRightWidth: 8,
      borderRightStyle: 'solid',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
    },
  },
}

export const BlockTooltip: FC<BlockTooltipPropertyType> = ({
  text,
  title,
  location = 'top',
  variant = 'default',
  maxWidth = 320,
  className,
  isPreview = false,
  showArrow = true,
  offset,
}) => {
  if (!text?.trim()) {
    return null
  }

  const palette = BLOCK_TOOLTIP_VARIANTS[variant]
  const position = POSITION_STYLES[location] ?? POSITION_STYLES.top

  const arrowColorStyles: CSSProperties = (() => {
    switch (location) {
      case 'bottom':
      case 'bottom-left':
      case 'bottom-right':
        return { borderBottomColor: palette.border }
      case 'left':
        return { borderLeftColor: palette.border }
      case 'right':
        return { borderRightColor: palette.border }
      default:
        return { borderTopColor: palette.border }
    }
  })()
  const maxWidthStyle = `min(${maxWidth}px, calc(100vw - 32px))`

  const applyOffset = (
    base: CSSProperties['top'],
    delta?: string,
  ): CSSProperties['top'] => {
    if (!delta || base === undefined) {
      return base
    }

    if (typeof base === 'number') {
      return `calc(${base}px + (${delta}))`
    }

    if (base === '0' || base === '0%') {
      return delta
    }

    return `calc(${base} + (${delta}))`
  }

  const resolvedTooltipStyle: CSSProperties = { ...position.tooltip }
  if (offset?.top) {
    resolvedTooltipStyle.top = applyOffset(resolvedTooltipStyle.top, offset.top)
  }
  if (offset?.bottom) {
    resolvedTooltipStyle.bottom = applyOffset(
      resolvedTooltipStyle.bottom,
      offset.bottom,
    )
  }
  if (offset?.left) {
    resolvedTooltipStyle.left = applyOffset(
      resolvedTooltipStyle.left,
      offset.left,
    )
  }
  if (offset?.right) {
    resolvedTooltipStyle.right = applyOffset(
      resolvedTooltipStyle.right,
      offset.right,
    )
  }

  return (
    <div
      className={clsx(
        'pointer-events-none absolute z-20 flex w-max text-left',
        className,
      )}
      style={resolvedTooltipStyle}>
      <div
        className={clsx(
          'flat-paper--colored relative overflow-hidden rounded-(--radius) border bg-(--card) px-4 py-3 text-xs leading-relaxed text-white/90 shadow-[0_0_24px_var(--shani-glow)]',
          isPreview && 'opacity-80',
        )}
        style={{
          borderColor: palette.border,
          maxWidth: maxWidthStyle,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: `0 0 28px ${palette.glow}`,
        }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, color-mix(in oklab, var(--neon-main) 4%, transparent) 3px, color-mix(in oklab, var(--neon-main) 4%, transparent) 6px)',
          }}
        />
        <div
          aria-hidden
          className="block-tooltip__scan-line pointer-events-none absolute inset-x-0 top-0 h-10 opacity-40"
          style={{
            background: `linear-gradient(180deg, ${palette.accent}25 0%, transparent 100%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-px opacity-70"
          style={{
            background: `linear-gradient(180deg, ${palette.accent}, transparent)`,
          }}
        />
        {title ? (
          <div
            className="relative z-10 mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: palette.accent }}>
            <span
              className="inline-block h-1 w-1 rounded-full"
              style={{
                background: palette.accent,
                boxShadow: `0 0 6px ${palette.accent}`,
              }}
            />
            {title}
          </div>
        ) : null}

        <div className="relative z-10 text-[13px] font-normal leading-relaxed text-white/90">
          {text}
        </div>
      </div>

      {showArrow ? (
        <span
          aria-hidden
          className="pointer-events-none absolute h-0 w-0"
          style={{
            ...position.arrow,
            ...arrowColorStyles,
          }}
        />
      ) : null}
    </div>
  )
}
