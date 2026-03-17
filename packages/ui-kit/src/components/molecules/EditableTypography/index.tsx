import * as React from 'react'
import type { ElementType } from 'react'

import { clsx } from '@infinityloop.labs/utils'

import {
  getDefaultColorByTypography,
  getPlaceholderTypographyClassName,
  getTypographyClassName,
  Typography,
  type TypographyColorType,
  type TypographyType,
} from '@/components/atoms/Typography'

type EditableTypographyPropertyType = {
  className?: string
  contentClassName?: string
  typography?: TypographyType
  element?: ElementType
  color?: TypographyColorType
  isEditModeDisabled?: boolean
  isLoading?: boolean
  value?: string
  defaultValue?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
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

export const EditableTypography = ({
  className,
  contentClassName,
  typography = 'Subheader',
  element = 'span',
  color,
  isEditModeDisabled = false,
  isLoading = false,
  value,
  defaultValue,
  placeholder,
  onValueChange,
  children,
}: EditableTypographyPropertyType) => {
  const [isEditModeOn, setIsEditModeOn] = React.useState(false)
  const [localTextValue, setLocalTextValue] = React.useState(() =>
    toStringValue(defaultValue),
  )
  const resolvedColor = color ?? getDefaultColorByTypography(typography)
  const typographyClassName = getTypographyClassName(typography)
  const placeholderTypographyClassName =
    getPlaceholderTypographyClassName(typography)

  const isExternallyControlled = value !== undefined
  const resolvedTextValue = isExternallyControlled
    ? toStringValue(value)
    : localTextValue

  React.useEffect(() => {
    if ((isEditModeDisabled || isLoading) && isEditModeOn) {
      setIsEditModeOn(false)
    }
  }, [isEditModeDisabled, isEditModeOn, isLoading])

  const handleEnableEditMode = () => {
    if (isEditModeDisabled || isLoading) {
      return
    }
    setIsEditModeOn(true)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value
    if (!isExternallyControlled) {
      setLocalTextValue(nextValue)
    }
    onValueChange?.(nextValue)
  }

  const handleInputBlur = () => {
    setIsEditModeOn(false)
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      setIsEditModeOn(false)
      ;(event.currentTarget as HTMLInputElement).blur()
    }
  }

  if (isEditModeOn && !isEditModeDisabled && !isLoading) {
    return (
      <div
        className={clsx('relative h-9 w-full', typographyClassName, className)}
        style={{ color: `var(--${resolvedColor})` }}>
        <input
          autoFocus
          value={resolvedTextValue}
          placeholder={placeholder}
          style={{
            color: 'inherit',
            caretColor: 'currentColor',
          }}
          className={clsx(
            'relative m-0 block h-auto w-full border-0 bg-transparent p-0 font-infinityloop',
            typographyClassName,
            placeholderTypographyClassName,
            contentClassName,
            'appearance-none outline-none shadow-none',
            'outline-none focus:outline-none focus-visible:outline-none',
            'focus:shadow-none focus-visible:shadow-none',
            'ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
          )}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
      </div>
    )
  }

  return (
    <div className={clsx('relative h-9 w-full', className)}>
      <Typography
        typography={typography}
        element={element}
        color={resolvedColor}
        isLoading={isLoading}
        className={clsx(
          'block w-full px-0',
          contentClassName,
          !isEditModeDisabled && !isLoading && 'cursor-text hover:opacity-90',
          isLoading && 'cursor-default',
        )}
        onClick={handleEnableEditMode}>
        {resolvedTextValue || children || placeholder || 'Click to edit'}
      </Typography>
    </div>
  )
}
