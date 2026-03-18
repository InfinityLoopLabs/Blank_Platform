import * as React from 'react'
import { CalendarDays } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { Calendar, type CalendarPropertyType } from '@/components/atoms/Calendar'
import {
  type CalendarPickerCalendarSlotPropertyType,
  type CalendarPickerControlStatePropertyType,
  formatCalendarValue,
  isDateRangeValue,
  type CalendarSelectionType,
  useOutsideDismiss,
  usePickerOpenState,
} from '@/components/atoms/shared/calendar-picker'
import {
  getPlaceholderTypographyClassName,
  getTypographyClassName,
  type TypographyType,
} from '@/components/atoms/Typography'
import { cn } from '@/lib/utils'

export type InputVariantType = 'outline' | 'text'

type InputSharedPropertyType = {
  className?: string
  variant?: InputVariantType
  typography?: TypographyType
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

type CalendarInputModePropertyType = InputCalendarPropertyType & {
  type: 'calendar'
  isTextarea?: false
}

type InputPropertyType =
  | SingleLineInputPropertyType
  | MultiLineInputPropertyType
  | CalendarInputModePropertyType

export type InputCalendarPropertyType = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> &
  Omit<
    CalendarPropertyType,
    'mode' | 'value' | 'onChange' | 'selected' | 'onSelect'
  > &
  CalendarPickerControlStatePropertyType &
  CalendarPickerCalendarSlotPropertyType<CalendarPropertyType> & {
    label?: React.ReactNode
    isRequired?: boolean
    isError?: boolean
    errorText?: React.ReactNode
    inputClassName?: string
    name?: string
    id?: string
  }

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
  'file:text-foreground selection:bg-primary selection:text-primary-foreground caret-foreground w-full min-w-0 field-transition required-indicator outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

const inputVariantClassNameDictionary: Record<InputVariantType, string> = {
  outline: 'rounded-md border border-border bg-background shadow-xs',
  text: 'rounded-none border-0 border-b border-border bg-transparent shadow-none',
}

const labelTypographyClassName = getTypographyClassName('Subheader')

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
      variant = 'outline',
      typography = 'Subheader',
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
    const typographyClassName = getTypographyClassName(typography)
    const placeholderTypographyClassName = getPlaceholderTypographyClassName(typography)
    const isInvalid = isError || ariaInvalid === true || ariaInvalid === 'true'
    const visibleErrorText = isError ? errorText : undefined

    return (
      <div className="w-full space-y-1">
        {label ? (
          <label
            htmlFor={textareaProperty.id}
            className={cn(
              'inline-flex items-center gap-1',
              labelTypographyClassName,
            )}>
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
            typographyClassName,
            placeholderTypographyClassName,
            inputVariantClassNameDictionary[variant],
            'h-auto py-2 leading-5 overflow-y-auto',
            variant === 'outline' ? 'px-3 focus-ring-3' : 'px-0 focus:outline-none',
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

  if ('type' in property && property.type === 'calendar') {
    const { type: _type, ...calendarProperty } =
      property as CalendarInputModePropertyType
    void _type

    return <InputCalendar {...calendarProperty} />
  }

  const singleLineProperty = property as SingleLineInputPropertyType

  const {
    className,
    isTextarea: _isTextarea,
    variant = 'outline',
    typography = 'Subheader',
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
  } = singleLineProperty
  const { onWheel, onKeyDown, ...restInputProperty } = inputProperty
  void _isTextarea
  void _isResizableX
  void _isResizableY
  void _textareaRowsCount
  const typographyClassName = getTypographyClassName(typography)
  const placeholderTypographyClassName = getPlaceholderTypographyClassName(typography)
  const isInvalid = isError || ariaInvalid === true || ariaInvalid === 'true'
  const visibleErrorText = isError ? errorText : undefined
  const isNumberType = type === 'number'
  const isCheckboxType = type === 'checkbox'

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

  if (isCheckboxType) {
    const checkboxInput = (
      <input
        type="checkbox"
        data-slot="input"
        aria-invalid={isInvalid ? true : ariaInvalid}
        className={cn(
          'size-4 shrink-0 rounded-sm border border-border bg-background text-primary field-transition',
          'focus-ring-3',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        {...restInputProperty}
      />
    )

    return (
      <div className="w-full space-y-1">
        {label ? (
          <label
            htmlFor={inputProperty.id}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2',
              labelTypographyClassName,
            )}>
            {checkboxInput}
            <span className="inline-flex items-center gap-1">
              {label}
              {required ? (
                <span aria-hidden className="text-cautionary">
                  *
                </span>
              ) : null}
            </span>
          </label>
        ) : (
          checkboxInput
        )}
        {visibleErrorText ? (
          <p className="text-sm text-destructive">{visibleErrorText}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="w-full space-y-1">
      {label ? (
        <label
          htmlFor={inputProperty.id}
          className={cn(
            'inline-flex items-center gap-1',
            labelTypographyClassName,
          )}>
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
          typographyClassName,
          placeholderTypographyClassName,
          inputVariantClassNameDictionary[variant],
          'h-9 py-1 resize-none',
          variant === 'outline' ? 'px-3 focus-ring-3' : 'px-0 focus:outline-none',
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

export const InputCalendar = ({
  className,
  inputClassName,
  label,
  isRequired = false,
  isError = false,
  errorText,
  placeholder = 'Select date',
  mode = 'single',
  value,
  defaultValue,
  onChange,
  isOpen,
  isOpenByDefault,
  onIsOpenChange,
  disabled = false,
  isLoading = false,
  calendarComponent: CalendarComponent = Calendar,
  numberOfMonths,
  name,
  id,
  ...calendarProperty
}: InputCalendarPropertyType) => {
  const isValueControlled = value !== undefined
  const [internalValue, setInternalValue] =
    React.useState<CalendarSelectionType>(defaultValue)
  const resolvedValue = isLoading
    ? undefined
    : isValueControlled
      ? value
      : internalValue
  const renderedValue = formatCalendarValue({
    mode,
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
  const generatedId = React.useId()
  const inputId = id ?? generatedId

  useOutsideDismiss(rootReference, isCalendarOpen, () => {
    setIsCalendarOpen(false)
  })

  const applyValueChange = (nextValue: CalendarSelectionType) => {
    if (!isValueControlled) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)

    if (mode === 'single' && nextValue instanceof Date) {
      setIsCalendarOpen(false)

      return
    }

    if (
      mode === 'range' &&
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
    <div
      ref={rootReference}
      className={cn('relative w-full space-y-1', className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
          {label}
          {isRequired ? (
            <span aria-hidden className="text-cautionary">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="relative flex w-full items-center">
        <input
          id={inputId}
          name={name}
          readOnly
          value={renderedValue}
          placeholder={placeholder}
          disabled={disabled}
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          onFocus={() => setIsCalendarOpen(true)}
          className={cn(
            'field-transition focus-ring-3 border-border bg-background text-foreground',
            'h-9 w-full rounded-md border py-1 pl-3 pr-10 text-sm outline-none',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            renderedValue === placeholder && 'text-muted-foreground',
            isError &&
              'border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
            inputClassName,
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="absolute right-2 inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground">
          <CalendarDays className="size-4" />
        </button>
      </div>

      {isCalendarOpen ? (
        <div className="border-border bg-card text-card-foreground absolute left-0 top-full z-50 mt-2 rounded-md border p-2 shadow-md">
          {mode === 'range' ? (
            <CalendarComponent
              {...calendarProperty}
              isLoading={isLoading}
              mode="range"
              selected={resolvedValue as DateRange | undefined}
              onSelect={handleRangeSelect}
              numberOfMonths={numberOfMonths ?? 2}
            />
          ) : (
            <CalendarComponent
              {...calendarProperty}
              isLoading={isLoading}
              mode="single"
              selected={resolvedValue as Date | undefined}
              onSelect={handleSingleSelect}
              numberOfMonths={numberOfMonths ?? 1}
            />
          )}
        </div>
      ) : null}

      {isError && errorText ? (
        <p className="text-sm text-destructive">{errorText}</p>
      ) : null}
    </div>
  )
}

export { Input }
