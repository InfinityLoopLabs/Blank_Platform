import * as React from 'react'
import type { DateRange } from 'react-day-picker'

export type CalendarPickerModeType = 'single' | 'range' | 'ranged'

export type CalendarPickerSelectionScopeType = 'date' | 'month' | 'monthYear'

export type CalendarSelectionType = Date | DateRange | undefined

export type CalendarPickerControlStatePropertyType = {
  mode?: CalendarPickerModeType
  selectionScope?: CalendarPickerSelectionScopeType
  value?: CalendarSelectionType
  defaultValue?: CalendarSelectionType
  onChange?: (value: CalendarSelectionType) => void
  placeholder?: string
  isOpen?: boolean
  isOpenByDefault?: boolean
  onIsOpenChange?: (isOpen: boolean) => void
  disabled?: boolean
  isLoading?: boolean
}

export type CalendarPickerCalendarSlotPropertyType<
  CalendarComponentPropertyType,
> = {
  calendarComponent?: React.ComponentType<CalendarComponentPropertyType>
}

export type CalendarPickerPopoverSlotPropertyType = {
  popoverComponent?: React.ComponentType<{ children: React.ReactNode }>
}

export const isDateRangeValue = (
  value: CalendarSelectionType,
): value is DateRange => {
  if (!value || value instanceof Date || typeof value !== 'object') {
    return false
  }

  return 'from' in value || 'to' in value
}

export const normalizeCalendarPickerMode = (
  mode: CalendarPickerModeType,
): 'single' | 'range' => (mode === 'ranged' ? 'range' : mode)

const formatCalendarDate = (
  date: Date,
  selectionScope: CalendarPickerSelectionScopeType,
) => {
  if (selectionScope === 'month') {
    return date.toLocaleDateString(undefined, {
      month: 'long',
    })
  }

  if (selectionScope === 'monthYear') {
    return date.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    })
  }

  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatCalendarValue = ({
  mode,
  selectionScope = 'date',
  value,
  placeholder,
}: {
  mode: CalendarPickerModeType
  selectionScope?: CalendarPickerSelectionScopeType
  value: CalendarSelectionType
  placeholder: string
}) => {
  const normalizedMode = normalizeCalendarPickerMode(mode)

  if (!value) {
    return placeholder
  }

  if (normalizedMode === 'single') {
    if (value instanceof Date) {
      return formatCalendarDate(value, selectionScope)
    }

    return placeholder
  }

  if (!isDateRangeValue(value)) {
    return placeholder
  }

  if (value.from && value.to) {
    return `${formatCalendarDate(value.from, selectionScope)} - ${formatCalendarDate(value.to, selectionScope)}`
  }

  if (value.from) {
    return `${formatCalendarDate(value.from, selectionScope)} - ...`
  }

  return placeholder
}

export const usePickerOpenState = <
  PropertyType extends { isOpen?: boolean; isOpenByDefault?: boolean },
>(
  property: PropertyType,
  onIsOpenChange?: (isOpen: boolean) => void,
) => {
  const isOpenControlled = property.isOpen !== undefined
  const [isOpenInternal, setIsOpenInternal] = React.useState(
    property.isOpenByDefault ?? false,
  )
  const isOpen = isOpenControlled ? (property.isOpen ?? false) : isOpenInternal

  const setIsOpen = React.useCallback(
    (nextIsOpen: boolean) => {
      if (!isOpenControlled) {
        setIsOpenInternal(nextIsOpen)
      }

      onIsOpenChange?.(nextIsOpen)
    },
    [isOpenControlled, onIsOpenChange],
  )

  return {
    isOpen,
    setIsOpen,
  }
}

export const useOutsideDismiss = (
  rootReference: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void,
) => {
  React.useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootReference.current?.contains(event.target as Node)) {
        onDismiss()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onDismiss, rootReference])
}
