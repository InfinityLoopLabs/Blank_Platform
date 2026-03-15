import * as React from 'react'
import type { ElementType } from 'react'

import { clsx } from '@infinityloop.labs/utils'

import { Input } from '@/components/atoms/Input'
import { Typography, type TypographyType } from '@/components/atoms/Typography'

type EditableTypographyPropertyType = {
  className?: string
  typography?: TypographyType
  element?: ElementType
  isEditModeDisabled?: boolean
  inputProps?: React.ComponentProps<typeof Input>
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
  typography = 'Subheader',
  element = 'span',
  isEditModeDisabled = false,
  inputProps,
  children,
}: EditableTypographyPropertyType) => {
  const [isEditModeOn, setIsEditModeOn] = React.useState(false)
  const [localTextValue, setLocalTextValue] = React.useState(() =>
    toStringValue(inputProps?.defaultValue),
  )

  const inputTypographyVariant = (inputProps?.typography ?? typography) as TypographyType

  const isExternallyControlled = inputProps?.value !== undefined
  const resolvedTextValue = isExternallyControlled
    ? toStringValue(inputProps?.value)
    : localTextValue

  React.useEffect(() => {
    if (isEditModeDisabled && isEditModeOn) {
      setIsEditModeOn(false)
    }
  }, [isEditModeDisabled, isEditModeOn])

  const handleEnableEditMode = () => {
    if (isEditModeDisabled) {
      return
    }
    setIsEditModeOn(true)
  }

  const handleInputBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!isExternallyControlled) {
      setLocalTextValue(event.currentTarget.value)
    }
    inputProps?.onBlur?.(event as never)
    setIsEditModeOn(false)
  }

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    inputProps?.onKeyDown?.(event as never)

    if (event.defaultPrevented || inputProps?.isTextarea) {
      return
    }

    if (event.key === 'Enter' || event.key === 'Escape') {
      if (!isExternallyControlled) {
        setLocalTextValue((event.currentTarget as HTMLInputElement).value)
      }
      setIsEditModeOn(false)
      ;(event.currentTarget as HTMLInputElement).blur()
    }
  }

  if (isEditModeOn && !isEditModeDisabled) {
    return (
      <div className={clsx('w-full', className)}>
        <Input
          {...inputProps}
          autoFocus
          variant="text"
          typography={inputTypographyVariant}
          {...(isExternallyControlled
            ? {}
            : {
                defaultValue: resolvedTextValue,
              })}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
      </div>
    )
  }

  return (
    <Typography
      typography={typography}
      element={element}
      className={clsx(
        'block w-full cursor-text py-0',
        !isEditModeDisabled && 'hover:opacity-90',
        className,
      )}
      onClick={handleEnableEditMode}
    >
      {resolvedTextValue || children || inputProps?.placeholder || 'Click to edit'}
    </Typography>
  )
}
