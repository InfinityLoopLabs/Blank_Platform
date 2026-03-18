import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'

type DayPickerPropertyType = React.ComponentProps<typeof DayPicker>

export type CalendarPropertyType = DayPickerPropertyType & {
  isLoading?: boolean
  value?: unknown
  onChange?: (...args: unknown[]) => void
}
const YEAR_PAGE_SIZE = 12

const getYearPageStart = (year: number) => year - (year % YEAR_PAGE_SIZE)

export const Calendar = ({
  className,
  classNames,
  isLoading = false,
  showOutsideDays,
  fixedWeeks,
  value,
  onChange,
  month,
  onMonthChange,
  onDayClick,
  mode,
  ...props
}: CalendarPropertyType) => {
  const isRangeMode = mode === 'range'
  const isMultiMonthView = (props.numberOfMonths ?? 1) > 1
  const isShowOutsideDaysEnabled = showOutsideDays ?? !isRangeMode
  const isFixedWeeksEnabled = fixedWeeks ?? true
  const initialDisplayedMonth = month ?? props.defaultMonth ?? new Date()
  const [isMonthPickerOpened, setIsMonthPickerOpened] = React.useState(false)
  const [isYearPickerOpened, setIsYearPickerOpened] = React.useState(false)
  const [displayedMonth, setDisplayedMonth] = React.useState<Date>(
    () => initialDisplayedMonth,
  )
  const [yearPageStart, setYearPageStart] = React.useState(() =>
    getYearPageStart(initialDisplayedMonth.getFullYear()),
  )
  const resolvedMonth = displayedMonth
  const monthNames = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, monthIndex) =>
        new Date(2026, monthIndex, 1).toLocaleDateString(undefined, {
          month: 'long',
        }),
      ),
    [],
  )
  const selectedClassName = isRangeMode
    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
    : 'rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'

  React.useEffect(() => {
    if (!month) {
      return
    }

    setDisplayedMonth(month)
    setYearPageStart(getYearPageStart(month.getFullYear()))
  }, [month?.getFullYear(), month?.getMonth()])

  const handleMonthChange = (nextMonth: Date) => {
    if (isLoading) {
      return
    }

    setDisplayedMonth(nextMonth)
    setYearPageStart(getYearPageStart(nextMonth.getFullYear()))
    onMonthChange?.(nextMonth)
  }

  const handleDayClick: NonNullable<CalendarPropertyType['onDayClick']> = (
    day,
    modifiers,
    event,
  ) => {
    if (isLoading) {
      return
    }

    onDayClick?.(day, modifiers, event)

    if (!isShowOutsideDaysEnabled || !modifiers.outside) {
      return
    }

    handleMonthChange(new Date(day.getFullYear(), day.getMonth(), 1))
  }

  const onMonthSelect = (monthIndex: number) => {
    if (isLoading) {
      return
    }

    handleMonthChange(new Date(resolvedMonth.getFullYear(), monthIndex, 1))
    setIsYearPickerOpened(false)
    setIsMonthPickerOpened(false)
  }

  const onYearSelect = (year: number) => {
    if (isLoading) {
      return
    }

    handleMonthChange(new Date(year, resolvedMonth.getMonth(), 1))
    setIsYearPickerOpened(false)
  }

  const onYearPageChange = (offset: number) => {
    if (isLoading) {
      return
    }

    setYearPageStart(previousStart => previousStart + offset * YEAR_PAGE_SIZE)
  }

  const yearOptions = React.useMemo(
    () =>
      Array.from(
        { length: YEAR_PAGE_SIZE },
        (_, yearOffset) => yearPageStart + yearOffset,
      ),
    [yearPageStart],
  )

  const dayPickerProps = {
    ...props,
    mode,
    fixedWeeks: isFixedWeeksEnabled,
    selected: isLoading
      ? undefined
      : (value ?? (props as { selected?: unknown }).selected),
    onSelect: onChange ?? (props as { onSelect?: unknown }).onSelect,
    showOutsideDays: isShowOutsideDaysEnabled,
    month: resolvedMonth,
    onMonthChange: handleMonthChange,
    onDayClick: handleDayClick,
    className: cn(
      'p-3',
      isLoading && 'pointer-events-none select-none',
      className,
    ),
    classNames: {
      months: 'flex flex-col gap-4 sm:flex-row sm:gap-4',
      month: cn(
        'relative flex w-[19rem] shrink-0 flex-col gap-3',
        isMultiMonthView &&
          'sm:border-l sm:border-border/45 sm:pl-5 sm:first:border-l-0 sm:first:pl-0',
      ),
      caption:
        'relative flex h-10 items-center justify-center px-10 text-foreground',
      caption_label: 'block max-w-full truncate text-sm font-semibold tracking-tight',
      nav: 'absolute inset-x-0 top-1 flex h-8 items-center justify-between',
      button_previous:
        'inline-flex size-8 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      button_next:
        'inline-flex size-8 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      month_caption: 'flex items-center justify-center',
      dropdowns: 'w-full flex items-center justify-center gap-2 text-sm',
      dropdown_root:
        'relative rounded-md border border-input bg-background text-foreground shadow-xs transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40',
      dropdown:
        'absolute inset-0 cursor-pointer opacity-0 disabled:pointer-events-none',
      months_dropdown: 'pl-3 pr-7 py-1.5',
      years_dropdown: 'pl-3 pr-7 py-1.5',
      weekdays: 'mt-1 flex w-full items-center gap-1',
      weekday:
        'w-10 rounded-md text-center text-[0.8rem] font-medium text-muted-foreground',
      week: 'mt-1.5 flex w-full items-center gap-1',
      day: 'relative h-10 w-10 p-0 text-center text-sm',
      day_button: cn(
        'inline-flex size-10 items-center justify-center whitespace-nowrap rounded-md border border-transparent p-0 font-normal text-foreground transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        'aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground',
        isLoading && 'relative overflow-hidden text-transparent',
      ),
      range_start:
        'day-range-start rounded-l-md rounded-r-none bg-primary text-primary-foreground shadow-[inset_-1px_0_0_color-mix(in_oklab,var(--background)_35%,transparent)]',
      range_end:
        'day-range-end rounded-r-md rounded-l-none bg-primary text-primary-foreground shadow-[inset_1px_0_0_color-mix(in_oklab,var(--background)_35%,transparent)]',
      range_middle:
        'day-range-middle rounded-none bg-muted/55 text-foreground shadow-[inset_-1px_0_0_color-mix(in_oklab,var(--background)_30%,transparent)]',
      selected: selectedClassName,
      today: isLoading
        ? '[&>button]:bg-transparent'
        : '[&>button]:rounded-md [&>button]:bg-accent/70 [&>button]:text-foreground',
      outside:
        '[&>button]:text-muted-foreground [&>button]:hover:bg-accent/45 [&>button]:hover:text-muted-foreground',
      disabled: 'text-muted-foreground opacity-45',
      hidden: 'invisible',
      ...classNames,
    },
    components: {
      Chevron: ({ className: iconClassName, orientation, ...iconProps }) => {
        if (orientation === 'left') {
          return (
            <ChevronLeft
              className={cn('size-4', iconClassName)}
              {...iconProps}
            />
          )
        }

        return (
          <ChevronRight
            className={cn('size-4', iconClassName)}
            {...iconProps}
          />
        )
      },
      DayButton: ({
        className: dayButtonClassName,
        children,
        ...dayButtonProps
      }: React.ComponentProps<'button'>) => (
        <button className={dayButtonClassName} {...dayButtonProps}>
          <span
            className={cn('relative z-10', isLoading && 'loading-text-blink')}>
            {isLoading ? '\u00A0' : children}
          </span>
          {isLoading ? (
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0 rounded-[inherit]',
                'loading-wave-overlay',
                'loading-wave',
              )}
            />
          ) : null}
        </button>
      ),
      CaptionLabel: ({ children }) => (
        <button
          type="button"
          onClick={() => {
            if (isLoading) {
              return
            }

            setIsMonthPickerOpened(previous => {
              const isNextOpen = !previous

              if (isNextOpen) {
                setYearPageStart(getYearPageStart(resolvedMonth.getFullYear()))
              } else {
                setIsYearPickerOpened(false)
              }

              return isNextOpen
            })
          }}
          className={cn(
            'cursor-pointer rounded-md px-2 py-1 text-sm font-semibold tracking-tight transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
            isLoading && 'relative min-w-28 overflow-hidden text-transparent',
          )}>
          <span
            className={cn('relative z-10', isLoading && 'loading-text-blink')}>
            {isLoading ? '\u00A0' : children}
          </span>
          {isLoading ? (
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0 rounded-[inherit]',
                'loading-wave-overlay',
                'loading-wave',
              )}
            />
          ) : null}
        </button>
      ),
    },
  } as React.ComponentProps<typeof DayPicker>

  return (
    <div className="relative">
      <DayPicker {...dayPickerProps} />
      {isMonthPickerOpened ? (
        <div className="absolute inset-0 z-30 rounded-(--radius) border border-border bg-background/95 p-3 backdrop-blur-md">
          <div className="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-2 px-1">
            <div className="flex items-center gap-1">
              {isYearPickerOpened ? (
                <>
                  <button
                    type="button"
                    onClick={() => onYearPageChange(-1)}
                    disabled={isLoading}
                    className={cn(
                      'inline-flex size-8 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
                      'disabled:pointer-events-none disabled:opacity-50',
                    )}>
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onYearPageChange(1)}
                    disabled={isLoading}
                    className={cn(
                      'inline-flex size-8 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
                      'disabled:pointer-events-none disabled:opacity-50',
                    )}>
                    <ChevronRight className="size-4" />
                  </button>
                </>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                if (isLoading) {
                  return
                }

                setIsYearPickerOpened(previous => !previous)
              }}
              disabled={isLoading}
              className={cn(
                'justify-self-center rounded-md px-2 py-1 text-sm font-semibold text-foreground transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                isLoading &&
                  'relative min-w-28 overflow-hidden text-transparent',
              )}>
              <span
                className={cn(
                  'relative z-10',
                  isLoading && 'loading-text-blink',
                )}>
                {isLoading
                  ? '\u00A0'
                  : isYearPickerOpened
                    ? `${yearPageStart} - ${yearPageStart + YEAR_PAGE_SIZE - 1}`
                    : resolvedMonth.getFullYear()}
              </span>
              {isLoading ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute inset-0 rounded-[inherit]',
                    'loading-wave-overlay',
                    'loading-wave',
                  )}
                />
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMonthPickerOpened(false)
                setIsYearPickerOpened(false)
              }}
              disabled={isLoading}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
              )}>
              close
            </button>
          </div>

          {isYearPickerOpened ? (
            <div className="grid h-[calc(100%-2.75rem)] grid-cols-3 gap-1.5">
              {yearOptions.map(year => {
                const isCurrentYear = resolvedMonth.getFullYear() === year

                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => onYearSelect(year)}
                    className={cn(
                      'inline-flex items-center justify-center rounded-md border border-transparent px-2 py-2 text-sm font-medium transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
                      isCurrentYear && 'bg-primary text-primary-foreground',
                      isLoading && 'relative overflow-hidden text-transparent',
                    )}>
                    <span
                      className={cn(
                        'relative z-10',
                        isLoading && 'loading-text-blink',
                      )}>
                      {isLoading ? '\u00A0' : year}
                    </span>
                    {isLoading ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          'pointer-events-none absolute inset-0 rounded-[inherit]',
                          'loading-wave-overlay',
                          'loading-wave',
                        )}
                      />
                    ) : null}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid h-[calc(100%-2.75rem)] grid-cols-3 gap-1.5">
              {monthNames.map((monthName, monthIndex) => {
                const isCurrentMonth = resolvedMonth.getMonth() === monthIndex

                return (
                  <button
                    key={monthName}
                    type="button"
                    onClick={() => onMonthSelect(monthIndex)}
                    className={cn(
                      'inline-flex items-center justify-center rounded-md border border-transparent px-2 py-2 text-sm font-medium capitalize transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
                      isCurrentMonth && 'bg-primary text-primary-foreground',
                      isLoading && 'relative overflow-hidden text-transparent',
                    )}>
                    <span
                      className={cn(
                        'relative z-10',
                        isLoading && 'loading-text-blink',
                      )}>
                      {isLoading ? '\u00A0' : monthName}
                    </span>
                    {isLoading ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          'pointer-events-none absolute inset-0 rounded-[inherit]',
                          'loading-wave-overlay',
                          'loading-wave',
                        )}
                      />
                    ) : null}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

Calendar.displayName = 'Calendar'
