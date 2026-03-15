import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

export type DropdownOptionType = {
  value: string
  label: string
}

type DropdownPropertyType = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  options: DropdownOptionType[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  label?: React.ReactNode
  required?: boolean
  isError?: boolean
  errorText?: React.ReactNode
  placeholder?: string
  isSearchable?: boolean
  searchPlaceholder?: string
  disabled?: boolean
  emptyText?: string
}

export const Dropdown = ({
  options,
  value,
  defaultValue,
  onValueChange,
  label,
  required = false,
  isError = false,
  errorText,
  placeholder = 'Select option',
  isSearchable = false,
  searchPlaceholder = 'Type to filter...',
  disabled = false,
  emptyText = 'No options found',
  id,
  'aria-invalid': ariaInvalid,
  className,
  ...property
}: DropdownPropertyType) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [internalValue, setInternalValue] = React.useState(defaultValue)

  const rootReference = React.useRef<HTMLDivElement | null>(null)
  const searchInputReference = React.useRef<HTMLInputElement | null>(null)
  const generatedId = React.useId()
  const triggerId = id ?? generatedId

  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : internalValue
  const selectedOption = options.find(option => option.value === selectedValue)
  const isInvalid = isError || ariaInvalid === true || ariaInvalid === 'true'
  const visibleErrorText = isError ? errorText : undefined

  const filteredOptions = React.useMemo(() => {
    if (!isSearchable || query.trim() === '') {
      return options
    }
    const normalizedQuery = query.trim().toLowerCase()

    return options.filter(option => option.label.toLowerCase().includes(normalizedQuery))
  }, [isSearchable, options, query])

  React.useEffect(() => {
    if (!isOpen || !isSearchable) {
      return
    }
    searchInputReference.current?.focus()
  }, [isOpen, isSearchable])

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootReference.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleSelect = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }
    onValueChange?.(nextValue)
    setIsOpen(false)
    setQuery('')
  }

  const toggleDropdown = () => {
    if (disabled) {
      return
    }
    setIsOpen(previousState => !previousState)
  }

  return (
    <div className="w-full space-y-2">
      {label || required ? (
        <div className="flex w-full items-start justify-between gap-2">
          {label ? (
            <label
              htmlFor={triggerId}
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
              {label}
            </label>
          ) : (
            <span />
          )}
          {required ? (
            <span aria-label="Required" className="text-lg leading-none text-cautionary">
              *
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        ref={rootReference}
        className={cn('relative w-full', className)}
        {...property}>
        <button
          id={triggerId}
          type="button"
          disabled={disabled}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-invalid={isInvalid ? true : ariaInvalid}
          aria-required={required || undefined}
          aria-haspopup="listbox"
          className={cn(
            'field-transition focus-ring-3 border-border bg-background text-foreground',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            'flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}>
          <span className={cn('truncate', !selectedOption && 'text-muted-foreground')}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen ? (
          <div
            role="listbox"
            className={cn(
              'bg-card text-card-foreground border-border absolute z-50 mt-2 w-full rounded-md border shadow-md',
              'max-h-64 overflow-hidden',
            )}>
            {isSearchable ? (
              <div className="border-border border-b p-2">
                <input
                  ref={searchInputReference}
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    'field-transition focus-ring-3 border-border bg-background text-foreground',
                    'w-full rounded-md border px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground',
                  )}
                />
              </div>
            ) : null}

            <div className="max-h-48 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <p className="px-2 py-2 text-sm text-muted-foreground">{emptyText}</p>
              ) : (
                filteredOptions.map(option => {
                  const isSelected = option.value === selectedValue

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm',
                        'hover:bg-accent hover:text-accent-foreground',
                        isSelected && 'bg-accent text-accent-foreground',
                      )}>
                      <span className="truncate">{option.label}</span>
                      {isSelected ? <Check className="size-4 shrink-0" /> : null}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        ) : null}
      </div>

      {visibleErrorText ? (
        <p className="text-sm text-destructive">{visibleErrorText}</p>
      ) : null}
    </div>
  )
}
