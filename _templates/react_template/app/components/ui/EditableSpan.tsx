import React, { type KeyboardEvent } from 'react'
import type { FC } from 'react'
import { clsx } from '@infinityloop.labs/utils'

export type EditableSpanPropertyType = {
  value: string
  isEditing: boolean
  placeholder?: string
  inputClassName?: string
  displayClassName?: string
  shouldDisplayPlaceholder?: boolean
  isMultiline?: boolean
  autoFocus?: boolean
  isButton?: boolean
  onEnableEditModeHandler?: VoidFunction
  onChangeHandler: Callback<string>
  onSubmitHandler?: VoidFunction
  onKeyDownHandler?: Callback<KeyboardEvent<HTMLInputElement>>
}

export const EditableSpan: FC<EditableSpanPropertyType> = ({
  value,
  isEditing,
  placeholder,
  inputClassName,
  displayClassName,
  shouldDisplayPlaceholder = true,
  isMultiline = false,
  autoFocus = false,
  isButton = false,
  onEnableEditModeHandler,
  onChangeHandler,
  onSubmitHandler,
  onKeyDownHandler,
}) => {
  const displayValue =
    value && value.length > 0
      ? value
      : shouldDisplayPlaceholder
        ? placeholder || ''
        : ''

  const handleBlur = () => {
    if (onSubmitHandler) {
      onSubmitHandler()
    }
  }

  if (isEditing) {
    if (isMultiline) {
      return (
        <textarea
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          className={clsx(
            'w-full rounded-(--radius) border border-orange-500/30 bg-transparent px-2 py-1 text-sm text-orange-50 outline-none',
            inputClassName,
          )}
          onChange={event => onChangeHandler(event.target.value)}
          onBlur={handleBlur}
        />
      )
    }

    return (
      <input
        type="text"
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-(--radius) border border-orange-500/30 bg-transparent px-2 py-1 text-sm text-orange-50 outline-none',
          inputClassName,
        )}
        onChange={event => onChangeHandler(event.target.value)}
        onBlur={handleBlur}
        onKeyDown={
          onKeyDownHandler ? event => onKeyDownHandler(event) : undefined
        }
      />
    )
  }

  if (onEnableEditModeHandler && isButton) {
    return (
      <button
        type="button"
        className={clsx(
          'w-full text-left text-inherit focus-visible:outline-none',
          displayClassName,
        )}
        onClick={onEnableEditModeHandler}>
        {displayValue}
      </button>
    )
  }

  return (
    <span className={clsx('block w-full text-inherit', displayClassName)}>
      {displayValue}
    </span>
  )
}
