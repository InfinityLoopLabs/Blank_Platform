import * as React from 'react'

import { cn } from '@/lib/utils'

type InputSharedPropertyType = {
  className?: string
  isTextarea?: boolean
  isResizableX?: boolean
  isResizableY?: boolean
  textareaRowsCount?: number
  isError?: boolean
  label?: React.ReactNode
  errorText?: React.ReactNode
}

type SingleLineInputPropertyType = InputSharedPropertyType &
  React.ComponentProps<'input'> & {
    isTextarea?: false
  }

type MultiLineInputPropertyType = InputSharedPropertyType &
  Omit<React.ComponentProps<'textarea'>, 'rows' | 'type'> & {
    isTextarea: true
  }

type InputPropertyType = SingleLineInputPropertyType | MultiLineInputPropertyType

const getTextareaResizeClassName = (
  isResizableX: boolean,
  isResizableY: boolean,
) => {
  if (isResizableX && isResizableY) {
    return 'resize'
  }
  if (isResizableX) {
    return 'resize-x'
  }
  if (isResizableY) {
    return 'resize-y'
  }
  return 'resize-none'
}

const commonClassName =
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-border text-foreground caret-foreground w-full min-w-0 rounded-md border bg-background text-base shadow-xs field-transition required-indicator outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'

const numberInputAllowedKeys = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Enter',
  'Escape',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
])

function Input(property: InputPropertyType) {
  if (property.isTextarea) {
    const {
      className,
      isTextarea: _isTextarea,
      isResizableX = false,
      isResizableY = false,
      textareaRowsCount = 4,
      required = false,
      isError = false,
      label,
      errorText,
      'aria-invalid': ariaInvalid,
      ...textareaProperty
    } = property
    void _isTextarea
    const isInvalid = isError || ariaInvalid === true || ariaInvalid === 'true'
    const visibleErrorText = isError ? errorText : undefined

    return (
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={textareaProperty.id}
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
            {label}
            {required ? (
              <span aria-hidden className="text-cautionary">
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <textarea
          data-slot="textarea"
          rows={textareaRowsCount}
          aria-invalid={isInvalid ? true : ariaInvalid}
          className={cn(
            commonClassName,
            'h-auto px-3 py-2 leading-5 overflow-y-auto',
            'focus-ring-3',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            getTextareaResizeClassName(isResizableX, isResizableY),
            className,
          )}
          {...textareaProperty}
        />
        {visibleErrorText ? (
          <p className="text-sm text-destructive">{visibleErrorText}</p>
        ) : null}
      </div>
    )
  }

  const {
    className,
    isTextarea: _isTextarea,
    isResizableX: _isResizableX,
    isResizableY: _isResizableY,
    textareaRowsCount: _textareaRowsCount,
    required = false,
    isError = false,
    label,
    errorText,
    'aria-invalid': ariaInvalid,
    type,
    ...inputProperty
  } = property
  const { onWheel, onKeyDown, ...restInputProperty } = inputProperty
  void _isTextarea
  void _isResizableX
  void _isResizableY
  void _textareaRowsCount
  const isInvalid = isError || ariaInvalid === true || ariaInvalid === 'true'
  const visibleErrorText = isError ? errorText : undefined
  const isNumberType = type === 'number'

  const handleNumberWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    onWheel?.(event)
    if (event.defaultPrevented || !isNumberType) {
      return
    }
    const currentInputElement = event.currentTarget
    if (document.activeElement !== currentInputElement) {
      return
    }
    if (currentInputElement.disabled || currentInputElement.readOnly) {
      return
    }
    if (event.deltaY === 0) {
      return
    }
    event.preventDefault()
    if (event.deltaY < 0) {
      currentInputElement.stepUp()
    } else {
      currentInputElement.stepDown()
    }
    currentInputElement.dispatchEvent(new Event('input', { bubbles: true }))
    currentInputElement.dispatchEvent(new Event('change', { bubbles: true }))
  }

  const handleNumberKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !isNumberType) {
      return
    }
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return
    }
    if (numberInputAllowedKeys.has(event.key)) {
      return
    }
    const isDigit = /^[0-9]$/.test(event.key)
    if (isDigit) {
      return
    }
    const currentInputElement = event.currentTarget
    if (event.key === '.') {
      const hasDot = currentInputElement.value.includes('.')
      if (!hasDot) {
        return
      }
    }
    if (event.key === '-') {
      const selectionStart = currentInputElement.selectionStart ?? 0
      const selectionEnd = currentInputElement.selectionEnd ?? 0
      const isReplacingLeadingMinus =
        currentInputElement.value.startsWith('-') &&
        selectionStart === 0 &&
        selectionEnd > 0
      if (selectionStart === 0 && !isReplacingLeadingMinus) {
        return
      }
    }
    event.preventDefault()
  }

  return (
    <div className="w-full space-y-2">
      {label ? (
        <label
          htmlFor={inputProperty.id}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
          {label}
          {required ? (
            <span aria-hidden className="text-cautionary">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <input
        type={type}
        data-slot="input"
        aria-invalid={isInvalid ? true : ariaInvalid}
        className={cn(
          commonClassName,
          'h-9 px-3 py-1 resize-none',
          'focus-ring-3',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
        )}
        onWheel={handleNumberWheel}
        onKeyDown={handleNumberKeyDown}
        {...restInputProperty}
      />
      {visibleErrorText ? (
        <p className="text-sm text-destructive">{visibleErrorText}</p>
      ) : null}
    </div>
  )
}

export { Input }
