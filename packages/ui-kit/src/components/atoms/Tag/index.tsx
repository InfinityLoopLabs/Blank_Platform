import {
  useEffect,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
} from 'react'

import { clsx } from '@infinityloop.labs/utils'

import {
  getTypographyClassName,
  Typography,
  type TypographyColorType,
} from '@/components/atoms/Typography'

export const TAG_TYPE_OPTIONS = ['default', 'time'] as const
export type TagType = (typeof TAG_TYPE_OPTIONS)[number]

export type TagPropertyType = HTMLAttributes<HTMLSpanElement> & {
  label: string
  type?: TagType
  color?: TypographyColorType
  textColor?: TypographyColorType
  isLoading?: boolean
  isEditModeEnabled?: boolean
  isEditModeDisabled?: boolean
  onLabelChange?: (value: string) => void
}

const tagTypeDefaultColorDictionary: Record<TagType, TypographyColorType> = {
  default: 'destructive',
  time: 'background',
}

const tagTypeDefaultTextColorDictionary: Record<TagType, TypographyColorType> =
  {
    default: 'foreground',
    time: 'foreground',
  }

export const Tag = ({
  label,
  type = 'default',
  color,
  textColor,
  className,
  isLoading = false,
  isEditModeEnabled = false,
  isEditModeDisabled = false,
  onLabelChange,
  ...property
}: TagPropertyType) => {
  const [localLabel, setLocalLabel] = useState(label)
  const resolvedBackgroundColor = color ?? tagTypeDefaultColorDictionary[type]
  const resolvedTextColor = textColor ?? tagTypeDefaultTextColorDictionary[type]
  const isEditModeResolvedEnabled =
    isEditModeEnabled && !isEditModeDisabled && !isLoading
  const isDestructiveTag = resolvedBackgroundColor === 'destructive'
  const resolvedTextStyle = isDestructiveTag
    ? '#ffffff'
    : `var(--${resolvedTextColor})`
  const resolvedTypography = type === 'time' ? 'Action' : 'CompactCaption'
  const contentClassName = clsx(
    getTypographyClassName(resolvedTypography),
    'font-semibold',
    type === 'default' && 'uppercase tracking-wide',
  )

  useEffect(() => {
    setLocalLabel(label)
  }, [label])

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value
    setLocalLabel(nextValue)
    onLabelChange?.(nextValue)
  }

  return (
    <span
      className={clsx(
        'inline-flex max-w-full items-center rounded-md px-2 py-1',
        className,
      )}
      style={{ backgroundColor: `var(--${resolvedBackgroundColor})` }}
      {...property}>
      {isEditModeResolvedEnabled ? (
        <input
          size={Math.max(1, localLabel.length)}
          value={localLabel}
          onChange={onInputChange}
          className={clsx(
            'inline-block max-w-full min-w-[1ch] w-auto border-none bg-transparent p-0 outline-none',
            '[field-sizing:content]',
            contentClassName,
          )}
          style={{ color: resolvedTextStyle }}
        />
      ) : (
        <Typography
          typography={resolvedTypography}
          element="span"
          color={resolvedTextColor}
          isLoading={isLoading}
          className={clsx('inline-block truncate', contentClassName)}
          style={{ color: resolvedTextStyle }}>
          {localLabel}
        </Typography>
      )}
    </span>
  )
}
