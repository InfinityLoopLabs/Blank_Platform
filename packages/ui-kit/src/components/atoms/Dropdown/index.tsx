import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Popover } from '@infinityloop.labs/utils'

import { Calendar, type CalendarPropertyType } from '@/components/atoms/Calendar'
import {
  type CalendarPickerCalendarSlotPropertyType,
  type CalendarPickerControlStatePropertyType,
  type CalendarPickerPopoverSlotPropertyType,
  formatCalendarValue,
  isDateRangeValue,
  normalizeCalendarPickerMode,
  type CalendarSelectionType,
  usePickerOpenState,
} from '@/components/atoms/shared/calendar-picker'
import { cn } from '@/lib/utils'

export type DropdownOptionType = {
  value: string
  label: string
}

type DropdownListPropertyType = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> & {
  type?: 'default'
  popoverComponent?: React.ComponentType<{ children: React.ReactNode }>
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

export type DropdownCalendarPropertyType = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> &
  Omit<
    CalendarPropertyType,
    'mode' | 'value' | 'onChange' | 'selected' | 'onSelect'
  > &
  CalendarPickerControlStatePropertyType &
  CalendarPickerPopoverSlotPropertyType &
  CalendarPickerCalendarSlotPropertyType<CalendarPropertyType> & {
    label?: React.ReactNode
    isRequired?: boolean
    isError?: boolean
    errorText?: React.ReactNode
    triggerClassName?: string
  }

export type DropdownPropertyType =
  | DropdownListPropertyType
  | (DropdownCalendarPropertyType & { type: 'calendar' })

type FloatingPanelPositionType = {
  top: number
  left: number
  width: number
}

const useFloatingPanelPosition = (
  isOpen: boolean,
  anchorReference: React.RefObject<HTMLElement | null>,
) => {
  const [position, setPosition] =
    React.useState<FloatingPanelPositionType | null>(null)

  React.useEffect(() => {
    if (!isOpen) {
      setPosition(null)

      return
    }

    const updatePosition = () => {
      const anchorElement = anchorReference.current
      if (!anchorElement) {
        return
      }

      const anchorRect = anchorElement.getBoundingClientRect()
      setPosition({
        top: anchorRect.bottom + 8,
        left: anchorRect.left,
        width: anchorRect.width,
      })
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [anchorReference, isOpen])

  return position
}

const useOutsideDismiss = ({
  isOpen,
  rootReference,
  panelReference,
  onDismiss,
}: {
  isOpen: boolean
  rootReference: React.RefObject<HTMLElement | null>
  panelReference: React.RefObject<HTMLElement | null>
  onDismiss: () => void
}) => {
  React.useEffect(() => {
    if (!isOpen) {
      return
    }

    const onMouseDown = (event: MouseEvent) => {
      const eventTarget = event.target as Node
      if (
        rootReference.current?.contains(eventTarget) ||
        panelReference.current?.contains(eventTarget)
      ) {
        return
      }

      onDismiss()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss()
      }
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onDismiss, panelReference, rootReference])
}

export const Dropdown = (property: DropdownPropertyType) => {
  if (property.type === 'calendar') {
    const { type: _type, ...calendarProperty } = property
    void _type

    return <DropdownCalendar {...calendarProperty} />
  }

  const {
    type: _type,
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
    popoverComponent: PopoverComponent = Popover,
    id,
    'aria-invalid': ariaInvalid,
    className,
    ...restProperty
  } = property as DropdownListPropertyType
  void _type
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [internalValue, setInternalValue] = React.useState(defaultValue)

  const rootReference = React.useRef<HTMLDivElement | null>(null)
  const triggerReference = React.useRef<HTMLButtonElement | null>(null)
  const panelReference = React.useRef<HTMLDivElement | null>(null)
  const searchInputReference = React.useRef<HTMLInputElement | null>(null)
  const generatedId = React.useId()
  const triggerId = id ?? generatedId
  const panelPosition = useFloatingPanelPosition(isOpen, triggerReference)

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

  useOutsideDismiss({
    isOpen,
    rootReference,
    panelReference,
    onDismiss: () => setIsOpen(false),
  })

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
        {...restProperty}>
        <button
          ref={triggerReference}
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

        {isOpen && panelPosition ? (
          <PopoverComponent>
            <div
              ref={panelReference}
              role="listbox"
              style={{
                position: 'fixed',
                top: panelPosition.top,
                left: panelPosition.left,
                width: panelPosition.width,
              }}
              className={cn(
                'bg-card text-card-foreground border-border z-50 rounded-md border shadow-md',
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
                  <p className="px-2 py-2 text-sm text-muted-foreground">
                    {emptyText}
                  </p>
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
                        {isSelected ? (
                          <Check className="size-4 shrink-0" />
                        ) : null}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </PopoverComponent>
        ) : null}
      </div>

      {visibleErrorText ? (
        <p className="text-sm text-destructive">{visibleErrorText}</p>
      ) : null}
    </div>
  )
}

export const DropdownCalendar = ({
  className,
  triggerClassName,
  label,
  isRequired = false,
  isError = false,
  errorText,
  placeholder = 'Select date',
  mode = 'single',
  selectionScope = 'date',
  value,
  defaultValue,
  onChange,
  isOpen,
  isOpenByDefault,
  onIsOpenChange,
  disabled = false,
  isLoading = false,
  popoverComponent: PopoverComponent = Popover,
  calendarComponent: CalendarComponent = Calendar,
  numberOfMonths,
  ...calendarProperty
}: DropdownCalendarPropertyType) => {
  const isValueControlled = value !== undefined
  const [internalValue, setInternalValue] =
    React.useState<CalendarSelectionType>(defaultValue)
  const resolvedValue = isLoading
    ? undefined
    : isValueControlled
      ? value
      : internalValue
  const resolvedMode = normalizeCalendarPickerMode(mode)
  const renderedLabel = formatCalendarValue({
    mode: resolvedMode,
    selectionScope,
    value: resolvedValue,
    placeholder,
  })
  const {
    isOpen: isCalendarOpen,
    setIsOpen: setIsCalendarOpen,
  } = usePickerOpenState(
    {
      isOpen,
      isOpenByDefault,
    },
    onIsOpenChange,
  )
  const rootReference = React.useRef<HTMLDivElement | null>(null)
  const triggerReference = React.useRef<HTMLButtonElement | null>(null)
  const panelReference = React.useRef<HTMLDivElement | null>(null)
  const panelPosition = useFloatingPanelPosition(isCalendarOpen, triggerReference)

  useOutsideDismiss({
    isOpen: isCalendarOpen,
    rootReference,
    panelReference,
    onDismiss: () => setIsCalendarOpen(false),
  })

  const applyValueChange = (nextValue: CalendarSelectionType) => {
    if (!isValueControlled) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)

    if (resolvedMode === 'single' && nextValue instanceof Date) {
      setIsCalendarOpen(false)

      return
    }

    if (
      resolvedMode === 'range' &&
      isDateRangeValue(nextValue) &&
      nextValue.from &&
      nextValue.to
    ) {
      setIsCalendarOpen(false)
    }
  }

  const handleSingleSelect = (nextValue: Date | undefined) => {
    applyValueChange(nextValue)
  }

  const handleRangeSelect = (nextValue: DateRange | undefined) => {
    applyValueChange(nextValue)
  }

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label || isRequired ? (
        <div className="flex w-full items-start justify-between gap-2">
          {label ? (
            <label className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
              {label}
            </label>
          ) : (
            <span />
          )}
          {isRequired ? (
            <span aria-label="Required" className="text-lg leading-none text-cautionary">
              *
            </span>
          ) : null}
        </div>
      ) : null}

      <div ref={rootReference} className="relative w-full">
        <button
          ref={triggerReference}
          type="button"
          disabled={disabled}
          aria-expanded={isCalendarOpen}
          aria-haspopup="dialog"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={cn(
            'field-transition focus-ring-3 border-border bg-background text-foreground',
            'flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            isError &&
              'border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
            triggerClassName,
          )}>
          <span className={cn('truncate', renderedLabel === placeholder && 'text-muted-foreground')}>
            {renderedLabel}
          </span>
          <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', isCalendarOpen && 'rotate-180')} />
        </button>

        {isCalendarOpen && panelPosition ? (
          <PopoverComponent>
            <div
              ref={panelReference}
              style={{
                position: 'fixed',
                top: panelPosition.top,
                left: panelPosition.left,
              }}
              className="border-border bg-card text-card-foreground z-50 w-max rounded-md border p-2 shadow-md">
              {resolvedMode === 'range' ? (
                <CalendarComponent
                  {...calendarProperty}
                  isLoading={isLoading}
                  selectionScope={selectionScope}
                  mode="range"
                  selected={resolvedValue as DateRange | undefined}
                  onSelect={handleRangeSelect}
                  numberOfMonths={numberOfMonths ?? 2}
                />
              ) : (
                <CalendarComponent
                  {...calendarProperty}
                  isLoading={isLoading}
                  selectionScope={selectionScope}
                  mode="single"
                  selected={resolvedValue as Date | undefined}
                  onSelect={handleSingleSelect}
                  numberOfMonths={numberOfMonths ?? 1}
                />
              )}
            </div>
          </PopoverComponent>
        ) : null}
      </div>

      {isError && errorText ? (
        <p className="text-sm text-destructive">{errorText}</p>
      ) : null}
    </div>
  )
}
