import { type FC } from 'react'

import { clsx } from '@infinityloop.labs/utils'
import * as mathJaxPackage from 'better-react-mathjax'
import { Flex } from '@/components/atoms/Flex'
import { Paper, type PaperPropertyType } from '@/components/atoms/Paper'
import { Typography } from '@/components/atoms/Typography'

const { MathJax, MathJaxContext } = mathJaxPackage

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

const normalizeForPreview = (input: string): string => {
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
    return unescapedValue
      .replace(/\$begin:math:display\$/gi, '\\[')
      .replace(/\$end:math:display\$/gi, '\\]')
  }

  if (hasMathDelimiters) {
    return unescapedValue
  }

  return `\\(${unescapedValue}\\)`
}

export type MathEquationBlockPropertyType = {
  title: string
  value: string
  isEditMode: boolean
  isSubmitting?: boolean
  actionLabel?: string
  onChangeTitle?: (value: string) => void
  onChangeValue?: (value: string) => void
  onSubmit?: VoidFunction
} & Omit<PaperPropertyType<'div'>, 'children'>

export const MathEquationBlock: FC<MathEquationBlockPropertyType> = ({
  title,
  value,
  isEditMode,
  isSubmitting = false,
  actionLabel,
  onChangeTitle,
  onChangeValue,
  onSubmit,
  className,
  isLoading = false,
  isColored = true,
  ...paperProperty
}) => {
  const resolvedActionLabel = actionLabel || 'Save'
  const renderedValue = normalizeForPreview(value)
  const isBusy = isSubmitting || isLoading
  const canAutoSubmit = isEditMode && Boolean(onSubmit)

  const onAutoSubmit = () => {
    if (!canAutoSubmit || isBusy) {
      return
    }

    onSubmit?.()
  }

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <Paper
        {...paperProperty}
        isLoading={isLoading}
        isColored={isColored}
        className={clsx('w-full flex flex-col gap-4', className)}>
        {isEditMode ? (
          <input
            type="text"
            value={title}
            disabled={isBusy}
            className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none placeholder:text-(--muted-foreground)"
            onChange={event => onChangeTitle?.(event.target.value)}
            onBlur={onAutoSubmit}
          />
        ) : null}

        {isEditMode ? (
          <textarea
            value={value}
            disabled={isBusy}
            className="min-h-[160px] w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-white outline-none placeholder:text-(--muted-foreground)"
            onChange={event => onChangeValue?.(event.target.value)}
            onBlur={onAutoSubmit}
          />
        ) : null}

        <Flex column className="gap-2">
          {!isEditMode && title ? (
            <Typography typography="CompactHeader" color="muted-foreground">
              {title}
            </Typography>
          ) : null}
          <div className="min-h-12 text-(--chart-1)">
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
      </Paper>
    </MathJaxContext>
  )
}

MathEquationBlock.displayName = 'MathEquationBlock'
