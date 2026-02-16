import React, { type FC, type KeyboardEvent } from 'react'
import { clsx } from '@infinityloop.labs/utils'

export type OwnPropertyType = {
  className?: string
  value: string
  placeholder?: string
  isEditing: boolean
  isSubmitting?: boolean
  onEnableEditModeHandler: VoidFunction
  onChangeHandler: Callback<string>
  onSubmitHandler: VoidFunction
  onKeyDownHandler?: Callback<KeyboardEvent<HTMLInputElement>>
}

export const TextCreationBlock: FC<OwnPropertyType> = ({
  className,
  value,
  placeholder,
  isEditing,
  isSubmitting,
  onEnableEditModeHandler,
  onChangeHandler,
  onSubmitHandler,
  onKeyDownHandler,
}) => (
  <div className={clsx('w-full', className)}>
    {isEditing ? (
      <input
        autoFocus
        value={value}
        placeholder={placeholder}
        disabled={isSubmitting}
        onChange={event => onChangeHandler(event.target.value)}
        onBlur={onSubmitHandler}
        onKeyDown={onKeyDownHandler}
        className={clsx(
          'w-full bg-transparent border-b border-neutral-600 text-white outline-none text-4xl font-bold',
        )}
      />
    ) : (
      <button
        type="button"
        className={clsx(
          'w-full text-left text-4xl font-bold text-white cursor-text',
          isSubmitting && 'opacity-60 cursor-not-allowed',
        )}
        onClick={onEnableEditModeHandler}
        disabled={isSubmitting}>
        {value || placeholder || 'Add text'}
      </button>
    )}
  </div>
)
