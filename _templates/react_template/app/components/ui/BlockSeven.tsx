import type { FC } from 'react'
import { GlowingButton } from '@components/GlowingButton'

type BlockType = 'gold' | 'silver' | 'bronze'

type ContentBlock = {
  title: string
  subtitle: string
  type: BlockType
}

type OwnPropertyType = {
  symbol: string
  header: string
  subheader: string
  questionsTitle?: string
  buttonText?: string
  footerText?: string
  blocks: ContentBlock[]
  questions: string[]
  onClickHandler?: VoidFunction
}

const blockStyles: Record<BlockType, { border: string; text: string }> = {
  gold: {
    border: 'border-orange-500',
    text: 'text-xl text-white',
  },
  silver: {
    border: 'border-neutral-600',
    text: 'text-neutral-300',
  },
  bronze: {
    border: 'border-orange-500/50',
    text: 'text-neutral-400',
  },
}

export const BlockSeven: FC<OwnPropertyType> = ({
  symbol,
  header,
  subheader,
  onClickHandler,
  footerText,
  buttonText,
  questionsTitle,
  blocks,
  questions,
}) => (
  <div className="bg-neutral-950 border border-orange-500/30 w-full">
    <div className="bg-orange-500/10 p-6 border-b border-orange-500/30 flex items-center gap-3 w-full">
      <GlowingButton isPulseRingEnabled className="">
        {symbol}
      </GlowingButton>
      <div className="w-full">
        <div className="text-xl text-white font-bold">{header}</div>
        <div className="text-orange-500 text-xs font-mono">{subheader}</div>
      </div>
    </div>
    <div className="p-6 space-y-5">
      {blocks.map(({ title, subtitle, type }, index) => {
        const { border, text } = blockStyles[type]

        return (
          <div
            key={`${title}-${index}`}
            className={`border-l-2 ${border} pl-4`}>
            <div className="text-neutral-500 text-xs mb-1 font-mono">
              {title}
            </div>
            <p className={text}>{subtitle}</p>
          </div>
        )
      })}
      {!!questions?.length && (
        <div className="bg-neutral-900 p-4 border border-neutral-800">
          {questionsTitle && (
            <div className="text-orange-500 text-xs mb-3 font-mono">
              {questionsTitle}
            </div>
          )}
          {questions.map((q, i) => (
            <div key={i} className="flex gap-3 text-neutral-400 mb-2">
              <span className="text-orange-500">{i + 1}.</span> {q}
            </div>
          ))}
        </div>
      )}
    </div>
    {(footerText || buttonText) && (
      <div className="p-4 bg-orange-500/10 border-t border-orange-500/30 flex justify-between items-center">
        {footerText && (
          <span className="text-orange-500 text-sm font-mono">
            {footerText}
          </span>
        )}
        {buttonText && (
          <button
            onClick={onClickHandler}
            className="px-4 py-2 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400">
            {buttonText}
          </button>
        )}
      </div>
    )}
  </div>
)
