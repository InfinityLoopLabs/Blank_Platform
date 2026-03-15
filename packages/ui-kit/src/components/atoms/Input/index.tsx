import * as React from 'react'

import { cn } from '@/lib/utils'

type InputSharedPropertyType = {
  className?: string
  isTextarea?: boolean
  isResizableX?: boolean
  isResizableY?: boolean
  textareaRows?: number
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
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-border text-foreground caret-foreground w-full min-w-0 rounded-md border bg-background text-base shadow-xs field-transition required-highlight outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'

function Input(property: InputPropertyType) {
  if (property.isTextarea) {
    const {
      className,
      isTextarea: _isTextarea,
      isResizableX = false,
      isResizableY = false,
      textareaRows = 4,
      ...textareaProperty
    } = property
    void _isTextarea

    return (
      <textarea
        data-slot="textarea"
        rows={textareaRows}
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
    )
  }

  const {
    className,
    isTextarea: _isTextarea,
    isResizableX: _isResizableX,
    isResizableY: _isResizableY,
    textareaRows: _textareaRows,
    type,
    ...inputProperty
  } = property
  void _isTextarea
  void _isResizableX
  void _isResizableY
  void _textareaRows

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        commonClassName,
        'h-9 px-3 py-1 resize-none',
        'focus-ring-3',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...inputProperty}
    />
  )
}

export { Input }
