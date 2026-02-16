import type { FC } from 'react'
import { clsx } from '@infinityloop.labs/utils'
import {
  TEXT_BLOCK_VARIANTS,
  type TextBlockVariantType,
} from '@constants/text-block'

type TextParagraphPropertyType = {
  text: string
  variant?: TextBlockVariantType
  className?: string
  label?: string
}

export const TextParagraph: FC<TextParagraphPropertyType> = ({
  text,
  variant = TEXT_BLOCK_VARIANTS.PARAGRAPH,
  className,
  label,
}) => (
  <div
    className={clsx(
      'flat-paper--colored relative rounded-r-(--radius) bg-transparent pl-7 pr-6 py-4 text-(--foreground)',
      className,
    )}>
    <span
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-full bg-(--neon-main)"
    />
    {label ? (
      <p className="text-(--primary) text-xs font-semibold uppercase tracking-widest">
        {label}
      </p>
    ) : null}
    <p
      className={clsx(
        'text-base leading-relaxed whitespace-pre-line',
        label && 'mt-1',
      )}>
      {text}
    </p>
  </div>
)
