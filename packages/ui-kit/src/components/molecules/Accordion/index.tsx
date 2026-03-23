import * as React from 'react'
import { clsx } from '@infinityloop.labs/utils'
import { ChevronDown } from 'lucide-react'

import { Paper } from '@/components/atoms/Paper'
import {
  Typography,
  type TypographyColorType,
  type TypographyType,
} from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'

export const ACCORDION_PAPER_TYPE_OPTIONS = [
  'dark',
  'light',
  'gradient',
] as const
export type AccordionPaperType = (typeof ACCORDION_PAPER_TYPE_OPTIONS)[number]

export type AccordionPropertyType = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> & {
  title?: React.ReactNode
  content?: React.ReactNode
  isOpen?: boolean
  isOpenByDefault?: boolean
  onOpenChange?: (isOpen: boolean) => void
  isToggleDisabled?: boolean
  isLoading?: boolean
  isEditModeEnabled?: boolean
  isEditModeDisabled?: boolean
  onTitleChange?: (value: string) => void
  onContentChange?: (value: string) => void
  titleTypography?: TypographyType
  contentTypography?: TypographyType
  titleColor?: TypographyColorType
  contentColor?: TypographyColorType
  titlePlaceholder?: string
  contentPlaceholder?: string
  paperType?: AccordionPaperType
  isPaperColored?: boolean
  isRoundedCornersDisabled?: boolean
}

const toStringValue = (value: unknown): string => {
  if (value === undefined || value === null) {
    return ''
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return String(value)
}

const isPrimitiveNode = (value: React.ReactNode) =>
  value === undefined ||
  value === null ||
  typeof value === 'string' ||
  typeof value === 'number'

export const Accordion = ({
  className,
  title,
  content,
  children,
  isOpen,
  isOpenByDefault = false,
  onOpenChange,
  isToggleDisabled = false,
  isLoading = false,
  isEditModeEnabled = false,
  isEditModeDisabled = false,
  onTitleChange,
  onContentChange,
  titleTypography = 'SectionHeader',
  contentTypography = 'BodySmall',
  titleColor,
  contentColor,
  titlePlaceholder = 'Accordion title',
  contentPlaceholder = 'Accordion content',
  paperType = 'dark',
  isPaperColored = false,
  isRoundedCornersDisabled = false,
  ...property
}: AccordionPropertyType) => {
  const [isOpenUncontrolled, setIsOpenUncontrolled] =
    React.useState(isOpenByDefault)
  const [localTitle, setLocalTitle] = React.useState(() => toStringValue(title))
  const [localContent, setLocalContent] = React.useState(() =>
    toStringValue(content),
  )
  const triggerId = React.useId()
  const contentId = React.useId()

  const isOpenControlled = isOpen !== undefined
  const isOpenResolved = isOpenControlled ? isOpen : isOpenUncontrolled
  const isEditModeResolvedEnabled =
    isEditModeEnabled && !isEditModeDisabled && !isLoading
  const isToggleResolvedDisabled = isToggleDisabled || isLoading

  const hasCustomChildren = children !== undefined && children !== null
  const isTitlePrimitive = isPrimitiveNode(title)
  const isContentPrimitive = isPrimitiveNode(content)

  const resolvedTitleNode = isTitlePrimitive
    ? localTitle || titlePlaceholder
    : title
  const resolvedContentNode = isContentPrimitive
    ? localContent || contentPlaceholder
    : content

  const setOpen = React.useCallback(
    (nextValue: boolean) => {
      if (!isOpenControlled) {
        setIsOpenUncontrolled(nextValue)
      }

      onOpenChange?.(nextValue)
    },
    [isOpenControlled, onOpenChange],
  )

  React.useEffect(() => {
    setLocalTitle(toStringValue(title))
  }, [title])

  React.useEffect(() => {
    setLocalContent(toStringValue(content))
  }, [content])

  const handleToggle = () => {
    if (isToggleResolvedDisabled) {
      return
    }

    setOpen(!isOpenResolved)
  }

  const handleTitleChange = (nextValue: string) => {
    setLocalTitle(nextValue)
    onTitleChange?.(nextValue)
  }

  const handleContentChange = (nextValue: string) => {
    setLocalContent(nextValue)
    onContentChange?.(nextValue)
  }

  return (
    <Paper
      className={clsx('w-full px-4 py-3', className)}
      type={paperType}
      isColored={isPaperColored}
      isRoundedCornersDisabled={isRoundedCornersDisabled}
      isLoading={isLoading}
      {...property}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {isEditModeResolvedEnabled ? (
            <EditableTypography
              typography={titleTypography}
              color={titleColor}
              value={localTitle}
              placeholder={titlePlaceholder}
              onValueChange={handleTitleChange}
              isEditModeDisabled={!isEditModeResolvedEnabled}
              className="!h-auto"
            />
          ) : (
            <Typography
              typography={titleTypography}
              color={titleColor}
              isLoading={isLoading}
              className={clsx(
                'block w-full',
                isToggleResolvedDisabled ? 'cursor-default' : 'cursor-pointer',
              )}
              onClick={handleToggle}>
              {resolvedTitleNode}
            </Typography>
          )}
        </div>

        <button
          id={triggerId}
          type="button"
          aria-controls={contentId}
          aria-expanded={isOpenResolved}
          disabled={isToggleResolvedDisabled}
          className={clsx(
            'flex size-8 shrink-0 items-center justify-center rounded-md border border-(--border)',
            'bg-transparent text-(--muted-foreground) transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring)',
            !isToggleResolvedDisabled && 'cursor-pointer hover:bg-(--accent)',
            isToggleResolvedDisabled && 'cursor-not-allowed opacity-60',
          )}
          onClick={handleToggle}>
          <ChevronDown
            className={clsx(
              'size-4 transition-transform duration-300 ease-in-out',
              isOpenResolved && 'rotate-180',
            )}
          />
        </button>
      </div>

      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        data-state={isOpenResolved ? 'open' : 'closed'}
        aria-hidden={!isOpenResolved}
        className={clsx(
          'grid transition-[grid-template-rows,opacity,margin-top] duration-300 ease-in-out',
          isOpenResolved
            ? 'mt-3 grid-rows-[1fr] opacity-100'
            : 'mt-0 grid-rows-[0fr] opacity-0',
        )}>
        <div className="min-h-0 overflow-hidden">
          <div
            className={clsx(
              'transition-[padding-top] duration-300 ease-in-out',
              isOpenResolved ? 'border-t border-(--border) pt-3' : 'pt-0',
            )}>
            {isEditModeResolvedEnabled ? (
              <EditableTypography
                typography={contentTypography}
                color={contentColor}
                value={localContent}
                placeholder={contentPlaceholder}
                onValueChange={handleContentChange}
                isEditModeDisabled={!isEditModeResolvedEnabled}
                className="!h-auto"
              />
            ) : hasCustomChildren && !isLoading ? (
              <div className="min-w-0">{children}</div>
            ) : (
              <Typography
                typography={contentTypography}
                color={contentColor}
                isLoading={isLoading}
                className="block w-full">
                {resolvedContentNode}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </Paper>
  )
}
