import type { FC } from 'react'
import { clsx } from '@infinityloop.labs/utils'
import {
  TEXT_BLOCK_VARIANTS,
  type TextBlockVariantType,
} from '@constants/text-block'

type TextRichBlockPropertyType = {
  text: string
  className?: string
  label?: string
  variant?: TextBlockVariantType
}

export const TextRichBlock: FC<TextRichBlockPropertyType> = ({
  text,
  className,
  label,
  variant = TEXT_BLOCK_VARIANTS.RICH_TEXT,
}) => {
  const isVizDotVariant = variant === TEXT_BLOCK_VARIANTS.VIZ_DOT
  const vizDotItems = isVizDotVariant
    ? text
        .split(/\r?\n/g)
        .map(item => item.trim())
        .filter(item => item.length > 0)
    : []
  const shouldRenderVizDotList = isVizDotVariant && vizDotItems.length > 0

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-(--radius) bg-transparent px-6 py-5 text-(--foreground)',
        className,
      )}>
      <div className="relative z-10 space-y-2">
        {label ? (
          <p className="text-(--primary) text-xs font-semibold uppercase tracking-widest">
            {label}
          </p>
        ) : null}
        {shouldRenderVizDotList ? (
          <div className="space-y-2 text-base leading-relaxed">
            {vizDotItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-start gap-3 text-(--foreground)">
                <span className="text-(--neon-main)">▸</span>
                <p className="text-base leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-line text-base leading-relaxed">
            {text}
          </div>
        )}
      </div>
    </div>
  )
}
