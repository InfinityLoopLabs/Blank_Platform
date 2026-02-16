import React, { type FC } from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { clsx } from '@infinityloop.labs/utils'
import * as mathJaxPackage from 'better-react-mathjax'
import { FlatPaper } from '@components/FlatPaper'
import { Typography } from '@components/ui/Typography'

const { MathJax, MathJaxContext } = mathJaxPackage

type MathEquationBlockProps = {
  title: string
  value: string
  isEditMode: boolean
  isSubmitting?: boolean
  className?: string
  actionLabel?: string
  onChangeTitle?: (value: string) => void
  onChangeValue?: (value: string) => void
  onSubmit?: VoidFunction
}

const mathJaxConfig = {
  loader: { load: ['input/tex', 'output/chtml'] },
  tex: {
    inlineMath: [
      ['\\(', '\\)'],
      ['$', '$'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  options: {
    enableMenu: false,
  },
}

export const MathEquationBlock: FC<MathEquationBlockProps> = ({
  title,
  value,
  isEditMode,
  isSubmitting,
  className,
  actionLabel,
  onChangeTitle,
  onChangeValue,
  onSubmit,
}) => {
  const resolvedActionLabel = actionLabel || 'Save'
  const canAutoSubmit = isEditMode && Boolean(onSubmit)
  const onAutoSubmit = () => {
    if (!canAutoSubmit || isSubmitting) {
      return
    }

    onSubmit?.()
  }
  const normalizeForPreview = (input: string) => {
    const trimmedValue = (input || '').trim()

    if (!trimmedValue) {
      return ''
    }

    const unescapedValue = trimmedValue.replace(/\\\\/g, '\\')
    const hasMathDelimiters =
      unescapedValue.includes('\\(') ||
      unescapedValue.includes('\\[') ||
      unescapedValue.includes('$$') ||
      unescapedValue.includes('\\begin') ||
      unescapedValue.includes('$') ||
      unescapedValue.includes('\\]')

    const hasCustomMarkers =
      unescapedValue.includes('$begin:math:display$') ||
      unescapedValue.includes('$end:math:display$')

    if (hasCustomMarkers) {
      const cleanedValue = unescapedValue
        .replace(/\$begin:math:display\$/gi, '\\[')
        .replace(/\$end:math:display\$/gi, '\\]')

      return cleanedValue
    }

    if (hasMathDelimiters) {
      return unescapedValue
    }

    return `\\(${unescapedValue}\\)`
  }

  const renderedValue = normalizeForPreview(value)

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <FlatPaper
        isColored
        className={clsx('w-full flex flex-col gap-4', className)}>
        {isEditMode && (
          <input
            type="text"
            value={title}
            disabled={isSubmitting}
            className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none placeholder:text-(--muted-foreground)"
            onChange={event => onChangeTitle?.(event.target.value)}
            onBlur={onAutoSubmit}
          />
        )}

        {isEditMode && (
          <textarea
            value={value}
            disabled={isSubmitting}
            className="min-h-[160px] w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none placeholder:text-(--muted-foreground)"
            onChange={event => onChangeValue?.(event.target.value)}
            onBlur={onAutoSubmit}
          />
        )}

        <Flex column className="gap-2">
          {!isEditMode && title ? (
            <div className="text-base font-semibold text-(--muted-foreground)">
              {title}
            </div>
          ) : null}
          <div className="min-h-12 text-(--shani-ember-soft)">
            <MathJax dynamic>{renderedValue}</MathJax>
          </div>
        </Flex>

        {isEditMode && onSubmit && isSubmitting ? (
          <Flex className="justify-end">
            <span className="text-xs uppercase tracking-widest text-(--muted-foreground)">
              {resolvedActionLabel}
            </span>
          </Flex>
        ) : null}
      </FlatPaper>
    </MathJaxContext>
  )
}
