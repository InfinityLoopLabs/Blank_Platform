import{j as e}from"./jsx-runtime-9bc08dc0.js";import{r as t}from"./index-0b625b07.js";import{W}from"./index.es-32ff2151.js";import{f as U,u as X,C as ee,n as ne,i as te}from"./index-5f96d35f.js";import{c}from"./utils-0998f52b.js";import{c as G}from"./createLucideIcon-00f6dee4.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],re=G("check",oe);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],Z=G("chevron-down",ae),$=(d,p)=>{const[r,s]=t.useState(null);return t.useEffect(()=>{if(!d){s(null);return}const a=()=>{const i=p.current;if(!i)return;const o=i.getBoundingClientRect();s({top:o.bottom+8,left:o.left,width:o.width})};return a(),window.addEventListener("resize",a),window.addEventListener("scroll",a,!0),()=>{window.removeEventListener("resize",a),window.removeEventListener("scroll",a,!0)}},[p,d]),r},Q=({isOpen:d,rootReference:p,panelReference:r,onDismiss:s})=>{t.useEffect(()=>{if(!d)return;const a=o=>{var m,v;const h=o.target;(m=p.current)!=null&&m.contains(h)||(v=r.current)!=null&&v.contains(h)||s()},i=o=>{o.key==="Escape"&&s()};return document.addEventListener("mousedown",a),document.addEventListener("keydown",i),()=>{document.removeEventListener("mousedown",a),document.removeEventListener("keydown",i)}},[d,s,r,p])},se=d=>{if(d.type==="calendar"){const{type:n,...y}=d;return e.jsx(K,{...y})}const{type:p,options:r,value:s,defaultValue:a,onValueChange:i,label:o,required:h=!1,isError:m=!1,errorText:v,placeholder:I="Select option",isSearchable:g=!1,searchPlaceholder:z="Type to filter...",disabled:L=!1,emptyText:q="No options found",popoverComponent:F=W,id:R,"aria-invalid":k,className:Y,..._}=d,[u,w]=t.useState(!1),[M,O]=t.useState(""),[D,S]=t.useState(a),V=t.useRef(null),f=t.useRef(null),x=t.useRef(null),C=t.useRef(null),T=t.useId(),P=R??T,b=$(u,f),j=s!==void 0,E=j?s:D,N=r.find(n=>n.value===E),l=m||k===!0||k==="true",A=m?v:void 0,B=t.useMemo(()=>{if(!g||M.trim()==="")return r;const n=M.trim().toLowerCase();return r.filter(y=>y.label.toLowerCase().includes(n))},[g,r,M]);t.useEffect(()=>{var n;!u||!g||(n=C.current)==null||n.focus()},[u,g]),Q({isOpen:u,rootReference:V,panelReference:x,onDismiss:()=>w(!1)});const H=n=>{j||S(n),i==null||i(n),w(!1),O("")},J=()=>{L||w(n=>!n)};return e.jsxs("div",{className:"w-full space-y-2",children:[o||h?e.jsxs("div",{className:"flex w-full items-start justify-between gap-2",children:[o?e.jsx("label",{htmlFor:P,className:"inline-flex items-center gap-1 text-sm font-medium text-foreground",children:o}):e.jsx("span",{}),h?e.jsx("span",{"aria-label":"Required",className:"text-lg leading-none text-cautionary",children:"*"}):null]}):null,e.jsxs("div",{ref:V,className:c("relative w-full",Y),..._,children:[e.jsxs("button",{ref:f,id:P,type:"button",disabled:L,onClick:J,"aria-expanded":u,"aria-invalid":l?!0:k,"aria-required":h||void 0,"aria-haspopup":"listbox",className:c("field-transition focus-ring-3 border-border bg-background text-foreground","aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive","flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm","disabled:cursor-not-allowed disabled:opacity-50"),children:[e.jsx("span",{className:c("truncate",!N&&"text-muted-foreground"),children:(N==null?void 0:N.label)??I}),e.jsx(Z,{className:c("size-4 text-muted-foreground transition-transform",u&&"rotate-180")})]}),u&&b?e.jsx(F,{children:e.jsxs("div",{ref:x,role:"listbox",style:{position:"fixed",top:b.top,left:b.left,width:b.width},className:c("bg-card text-card-foreground border-border z-50 rounded-md border shadow-md","max-h-64 overflow-hidden"),children:[g?e.jsx("div",{className:"border-border border-b p-2",children:e.jsx("input",{ref:C,value:M,onChange:n=>O(n.target.value),placeholder:z,className:c("field-transition focus-ring-3 border-border bg-background text-foreground","w-full rounded-md border px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground")})}):null,e.jsx("div",{className:"max-h-48 overflow-y-auto p-1",children:B.length===0?e.jsx("p",{className:"px-2 py-2 text-sm text-muted-foreground",children:q}):B.map(n=>{const y=n.value===E;return e.jsxs("button",{type:"button",role:"option","aria-selected":y,onClick:()=>H(n.value),className:c("flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm","hover:bg-accent hover:text-accent-foreground",y&&"bg-accent text-accent-foreground"),children:[e.jsx("span",{className:"truncate",children:n.label}),y?e.jsx(re,{className:"size-4 shrink-0"}):null]},n.value)})})]})}):null]}),A?e.jsx("p",{className:"text-sm text-destructive",children:A}):null]})},K=({className:d,triggerClassName:p,label:r,isRequired:s=!1,isError:a=!1,errorText:i,placeholder:o="Select date",mode:h="single",selectionScope:m="date",value:v,defaultValue:I,onChange:g,isOpen:z,isOpenByDefault:L,onIsOpenChange:q,disabled:F=!1,isLoading:R=!1,popoverComponent:k=W,calendarComponent:Y=ee,numberOfMonths:_,...u})=>{const w=v!==void 0,[M,O]=t.useState(I),D=R?void 0:w?v:M,S=ne(h),V=U({mode:S,selectionScope:m,value:D,placeholder:o}),{isOpen:f,setIsOpen:x}=X({isOpen:z,isOpenByDefault:L},q),C=t.useRef(null),T=t.useRef(null),P=t.useRef(null),b=$(f,T);Q({isOpen:f,rootReference:C,panelReference:P,onDismiss:()=>x(!1)});const j=l=>{if(w||O(l),g==null||g(l),S==="single"&&l instanceof Date){x(!1);return}S==="range"&&te(l)&&l.from&&l.to&&x(!1)},E=l=>{j(l)},N=l=>{j(l)};return e.jsxs("div",{className:c("w-full space-y-2",d),children:[r||s?e.jsxs("div",{className:"flex w-full items-start justify-between gap-2",children:[r?e.jsx("label",{className:"inline-flex items-center gap-1 text-sm font-medium text-foreground",children:r}):e.jsx("span",{}),s?e.jsx("span",{"aria-label":"Required",className:"text-lg leading-none text-cautionary",children:"*"}):null]}):null,e.jsxs("div",{ref:C,className:"relative w-full",children:[e.jsxs("button",{ref:T,type:"button",disabled:F,"aria-expanded":f,"aria-haspopup":"dialog",onClick:()=>x(!f),className:c("field-transition focus-ring-3 border-border bg-background text-foreground","flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm","disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",a&&"border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",p),children:[e.jsx("span",{className:c("truncate",V===o&&"text-muted-foreground"),children:V}),e.jsx(Z,{className:c("size-4 text-muted-foreground transition-transform",f&&"rotate-180")})]}),f&&b?e.jsx(k,{children:e.jsx("div",{ref:P,style:{position:"fixed",top:b.top,left:b.left},className:"border-border bg-card text-card-foreground z-50 w-max rounded-md border p-2 shadow-md",children:S==="range"?e.jsx(Y,{...u,isLoading:R,selectionScope:m,mode:"range",selected:D,onSelect:N,numberOfMonths:_??2}):e.jsx(Y,{...u,isLoading:R,selectionScope:m,mode:"single",selected:D,onSelect:E,numberOfMonths:_??1})})}):null]}),a&&i?e.jsx("p",{className:"text-sm text-destructive",children:i}):null]})};se.__docgenInfo={description:"",methods:[],displayName:"Dropdown"};K.__docgenInfo={description:"",methods:[],displayName:"DropdownCalendar",props:{mode:{required:!1,tsType:{name:"union",raw:"'single' | 'range' | 'ranged'",elements:[{name:"literal",value:"'single'"},{name:"literal",value:"'range'"},{name:"literal",value:"'ranged'"}]},description:"",defaultValue:{value:"'single'",computed:!1}},selectionScope:{required:!1,tsType:{name:"union",raw:"'date' | 'month' | 'monthYear'",elements:[{name:"literal",value:"'date'"},{name:"literal",value:"'month'"},{name:"literal",value:"'monthYear'"}]},description:"",defaultValue:{value:"'date'",computed:!1}},value:{required:!1,tsType:{name:"union",raw:"Date | DateRange | undefined",elements:[{name:"Date"},{name:"DateRange"},{name:"undefined"}]},description:""},defaultValue:{required:!1,tsType:{name:"union",raw:"Date | DateRange | undefined",elements:[{name:"Date"},{name:"DateRange"},{name:"undefined"}]},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: CalendarSelectionType) => void",signature:{arguments:[{type:{name:"union",raw:"Date | DateRange | undefined",elements:[{name:"Date"},{name:"DateRange"},{name:"undefined"}]},name:"value"}],return:{name:"void"}}},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Select date'",computed:!1}},isOpen:{required:!1,tsType:{name:"boolean"},description:""},isOpenByDefault:{required:!1,tsType:{name:"boolean"},description:""},onIsOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(isOpen: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"isOpen"}],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},popoverComponent:{required:!1,tsType:{name:"ReactComponentType",raw:"React.ComponentType<{ children: React.ReactNode }>",elements:[{name:"signature",type:"object",raw:"{ children: React.ReactNode }",signature:{properties:[{key:"children",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}}]}}]},description:"",defaultValue:{value:"Popover",computed:!0}},calendarComponent:{required:!1,tsType:{name:"ReactComponentType",raw:"React.ComponentType<CalendarComponentPropertyType>",elements:[{name:"CalendarComponentPropertyType"}]},description:"",defaultValue:{value:`({
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
  mode = 'single',
  selectionScope = 'date',
  ...props
}: CalendarPropertyType) => {
  const resolvedMode = normalizeCalendarPickerMode(mode)
  const isRangeMode = resolvedMode === 'range'
  const isMonthSelectionView = selectionScope !== 'date'
  const supportsYearSelection = selectionScope !== 'month'
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

    const nextMonthDate = new Date(resolvedMonth.getFullYear(), monthIndex, 1)

    if (isMonthSelectionView) {
      if (resolvedMode === 'single') {
        onSelectValue?.(nextMonthDate)
      } else {
        const currentRange =
          isDateRangeValue(selectedValue) && selectedValue.from
            ? {
                from: toMonthStartDate(selectedValue.from),
                to: selectedValue.to
                  ? toMonthStartDate(selectedValue.to)
                  : undefined,
              }
            : undefined

        let nextRange: { from: Date; to?: Date }

        if (!currentRange?.from || currentRange.to) {
          nextRange = {
            from: nextMonthDate,
            to: undefined,
          }
        } else if (monthSerial(nextMonthDate) < monthSerial(currentRange.from)) {
          nextRange = {
            from: nextMonthDate,
            to: currentRange.from,
          }
        } else {
          nextRange = {
            from: currentRange.from,
            to: nextMonthDate,
          }
        }

        onSelectValue?.(nextRange)
      }
    } else {
      handleMonthChange(nextMonthDate)
      setIsMonthPickerOpened(false)
    }

    setIsYearPickerOpened(false)
  }

  const onYearSelect = (year: number) => {
    if (isLoading || !supportsYearSelection) {
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

  const selectedValue = (isLoading
    ? undefined
    : (value ?? (props as { selected?: unknown }).selected)) as CalendarSelectionType
  const onSelectValue = onChange ?? (props as { onSelect?: (...args: any[]) => void }).onSelect

  React.useEffect(() => {
    if (isMonthSelectionView) {
      setIsMonthPickerOpened(true)
    }
  }, [isMonthSelectionView])

  React.useEffect(() => {
    if (!selectedValue) {
      return
    }

    const anchorDate =
      selectedValue instanceof Date
        ? selectedValue
        : isDateRangeValue(selectedValue)
          ? selectedValue.from ?? selectedValue.to
          : undefined

    if (!anchorDate) {
      return
    }

    setDisplayedMonth(anchorDate)
    setYearPageStart(getYearPageStart(anchorDate.getFullYear()))
  }, [
    selectedValue instanceof Date ? selectedValue.getTime() : undefined,
    isDateRangeValue(selectedValue) && selectedValue.from
      ? selectedValue.from.getTime()
      : undefined,
    isDateRangeValue(selectedValue) && selectedValue.to
      ? selectedValue.to.getTime()
      : undefined,
  ])

  const dayPickerProps = {
    ...props,
    mode: resolvedMode,
    fixedWeeks: isFixedWeeksEnabled,
    selected: selectedValue,
    onSelect: onSelectValue,
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
            {isLoading ? '\\u00A0' : children}
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
            if (isLoading || isMonthSelectionView) {
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
            {isLoading ? '\\u00A0' : children}
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

  const monthRange =
    isDateRangeValue(selectedValue) && selectedValue.from
      ? {
          from: toMonthStartDate(selectedValue.from),
          to: selectedValue.to ? toMonthStartDate(selectedValue.to) : undefined,
        }
      : undefined
  const singleSelectedMonth =
    selectedValue instanceof Date ? toMonthStartDate(selectedValue) : undefined

  const renderMonthPicker = (isStandalone: boolean) => (
    <div
      className={cn(
        isStandalone
          ? 'relative rounded-(--radius) border border-border bg-background/95 p-3 backdrop-blur-md'
          : 'absolute inset-0 z-30 rounded-(--radius) border border-border bg-background/95 p-3 backdrop-blur-md',
      )}>
      <div className="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-2 px-1">
        <div className="flex items-center gap-1">
          {isYearPickerOpened && supportsYearSelection ? (
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

        {supportsYearSelection ? (
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
              isLoading && 'relative min-w-28 overflow-hidden text-transparent',
            )}>
            <span className={cn('relative z-10', isLoading && 'loading-text-blink')}>
              {isLoading
                ? '\\u00A0'
                : isYearPickerOpened
                  ? \`\${yearPageStart} - \${yearPageStart + YEAR_PAGE_SIZE - 1}\`
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
        ) : (
          <span className="justify-self-center px-2 py-1 text-sm font-semibold text-foreground">
            {resolvedMonth.getFullYear()}
          </span>
        )}

        {!isStandalone ? (
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
        ) : (
          <span />
        )}
      </div>

      {isYearPickerOpened && supportsYearSelection ? (
        <div className={cn('grid grid-cols-3 gap-1.5', !isStandalone && 'h-[calc(100%-2.75rem)]')}>
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
                <span className={cn('relative z-10', isLoading && 'loading-text-blink')}>
                  {isLoading ? '\\u00A0' : year}
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
        <div className={cn('grid grid-cols-3 gap-1.5', !isStandalone && 'h-[calc(100%-2.75rem)]')}>
          {monthNames.map((monthName, monthIndex) => {
            const monthDate = new Date(resolvedMonth.getFullYear(), monthIndex, 1)
            const monthValue = monthSerial(monthDate)
            const selectedMonthValue = singleSelectedMonth
              ? monthSerial(singleSelectedMonth)
              : undefined
            const rangeFromValue = monthRange?.from
              ? monthSerial(monthRange.from)
              : undefined
            const rangeToValue = monthRange?.to ? monthSerial(monthRange.to) : undefined

            const isCurrentMonth = resolvedMonth.getMonth() === monthIndex
            const isSingleSelectedMonth =
              selectedMonthValue !== undefined && selectedMonthValue === monthValue
            const isRangeStart =
              rangeFromValue !== undefined && rangeFromValue === monthValue
            const isRangeEnd = rangeToValue !== undefined && rangeToValue === monthValue
            const isRangeMiddle =
              rangeFromValue !== undefined &&
              rangeToValue !== undefined &&
              monthValue > rangeFromValue &&
              monthValue < rangeToValue

            const isRangeSingleMonth = isRangeStart && isRangeEnd

            return (
              <button
                key={monthName}
                type="button"
                onClick={() => onMonthSelect(monthIndex)}
                className={cn(
                  'inline-flex items-center justify-center rounded-md border border-transparent px-2 py-2 text-sm font-medium capitalize transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
                  !isMonthSelectionView && isCurrentMonth && 'bg-primary text-primary-foreground',
                  isMonthSelectionView &&
                    resolvedMode === 'single' &&
                    isSingleSelectedMonth &&
                    'bg-primary text-primary-foreground',
                  isMonthSelectionView &&
                    resolvedMode === 'range' &&
                    isRangeSingleMonth &&
                    'bg-primary text-primary-foreground',
                  isMonthSelectionView &&
                    resolvedMode === 'range' &&
                    isRangeStart &&
                    !isRangeSingleMonth &&
                    'rounded-l-md rounded-r-none bg-primary text-primary-foreground',
                  isMonthSelectionView &&
                    resolvedMode === 'range' &&
                    isRangeEnd &&
                    !isRangeSingleMonth &&
                    'rounded-r-md rounded-l-none bg-primary text-primary-foreground',
                  isMonthSelectionView &&
                    resolvedMode === 'range' &&
                    isRangeMiddle &&
                    'rounded-none bg-muted/55 text-foreground',
                  isLoading && 'relative overflow-hidden text-transparent',
                )}>
                <span className={cn('relative z-10', isLoading && 'loading-text-blink')}>
                  {isLoading ? '\\u00A0' : monthName}
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
  )

  return (
    <div className="relative">
      {isMonthSelectionView ? (
        renderMonthPicker(true)
      ) : (
        <>
          <DayPicker {...dayPickerProps} />
          {isMonthPickerOpened ? renderMonthPicker(false) : null}
        </>
      )}
    </div>
  )
}`,computed:!1}},label:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},isRequired:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},isError:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},errorText:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},triggerClassName:{required:!1,tsType:{name:"string"},description:""}}};export{se as D};
