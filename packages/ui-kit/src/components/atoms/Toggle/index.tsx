import * as React from 'react'

import { cn } from '@/lib/utils'

type TogglePropertyType = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> & {
  className?: string
  leftLabel?: React.ReactNode
  rightLabel?: React.ReactNode
  labelClassName?: string
}

export const Toggle = ({
  className,
  leftLabel,
  rightLabel,
  labelClassName,
  id,
  disabled = false,
  ...property
}: TogglePropertyType) => {
  const generatedId = React.useId()
  const resolvedId = id ?? generatedId
  const resolvedLabelClassName = cn(
    'select-none text-sm text-foreground',
    disabled && 'cursor-not-allowed opacity-60',
    labelClassName,
  )

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      {leftLabel ? (
        <label htmlFor={resolvedId} className={resolvedLabelClassName}>
          {leftLabel}
        </label>
      ) : null}

      <label
        htmlFor={resolvedId}
        className={cn(
          'relative inline-flex h-6 w-11 items-center',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        )}>
        <input
          id={resolvedId}
          type="checkbox"
          disabled={disabled}
          className="peer sr-only"
          {...property}
        />
        <span
          aria-hidden
          className={cn(
            'block h-full w-full rounded-full border border-border bg-muted field-transition',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-(--card)',
            'peer-checked:border-primary peer-checked:bg-primary/90',
          )}
        />
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute top-1/2 left-0.5 h-5 w-5 -translate-y-1/2 rounded-full bg-background shadow-xs field-transition',
            'peer-checked:translate-x-5 peer-checked:bg-primary-foreground',
          )}
        />
      </label>

      {rightLabel ? (
        <label htmlFor={resolvedId} className={resolvedLabelClassName}>
          {rightLabel}
        </label>
      ) : null}
    </div>
  )
}
