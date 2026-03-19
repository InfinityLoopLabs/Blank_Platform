import{j as n}from"./jsx-runtime-9bc08dc0.js";import{r as b}from"./index-0b625b07.js";import{W as Q}from"./index.es-32ff2151.js";import{f as ee,u as ne,C as te,n as ae,i as re}from"./index-5f96d35f.js";import{d as K,e as Z}from"./index-99726b4a.js";import{c as h}from"./utils-0998f52b.js";import{c as oe}from"./createLucideIcon-00f6dee4.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]],se=oe("calendar-days",ie),le=(t,i)=>t&&i?"resize":t?"resize-x":i?"resize-y":"resize-none",$="file:text-foreground selection:bg-primary selection:text-primary-foreground caret-foreground w-full min-w-0 field-transition required-indicator outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",U={outline:"rounded-md border border-border bg-background shadow-xs",text:"rounded-none border-0 border-b border-border bg-transparent shadow-none"},B=K("Subheader"),de=new Set(["Backspace","Delete","Tab","Enter","Escape","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"]),ce=(t,i)=>{const[u,m]=b.useState(null);return b.useEffect(()=>{if(!t){m(null);return}const a=()=>{const d=i.current;if(!d)return;const c=d.getBoundingClientRect();m({top:c.bottom+8,left:c.left})};return a(),window.addEventListener("resize",a),window.addEventListener("scroll",a,!0),()=>{window.removeEventListener("resize",a),window.removeEventListener("scroll",a,!0)}},[i,t]),u},ue=({isOpen:t,rootReference:i,panelReference:u,onDismiss:m})=>{b.useEffect(()=>{if(!t)return;const a=c=>{var v,p;const S=c.target;(v=i.current)!=null&&v.contains(S)||(p=u.current)!=null&&p.contains(S)||m()},d=c=>{c.key==="Escape"&&m()};return document.addEventListener("mousedown",a),document.addEventListener("keydown",d),()=>{document.removeEventListener("mousedown",a),document.removeEventListener("keydown",d)}},[t,m,u,i])};function me(t){if(t.isTextarea){const{className:e,isTextarea:r,variant:s="outline",typography:o="Subheader",isResizableX:k=!1,isResizableY:N=!1,textareaRowsCount:I=4,required:P=!1,isError:j=!1,label:T,errorText:O,"aria-invalid":Y,...z}=t,l=K(o),H=Z(o),J=j||Y===!0||Y==="true",G=j?O:void 0;return n.jsxs("div",{className:"w-full space-y-1",children:[T?n.jsxs("label",{htmlFor:z.id,className:h("inline-flex items-center gap-1",B),children:[T,P?n.jsx("span",{"aria-hidden":!0,className:"text-cautionary",children:"*"}):null]}):null,n.jsx("textarea",{"data-slot":"textarea",rows:I,"aria-invalid":J?!0:Y,className:h($,l,H,U[s],"h-auto py-2 leading-5 overflow-y-auto",s==="outline"?"px-3 focus-ring-3":"px-0 focus:outline-none","aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",le(k,N),e),...z}),G?n.jsx("p",{className:"text-sm text-destructive",children:G}):null]})}if("type"in t&&t.type==="calendar"){const{type:e,...r}=t;return n.jsx(X,{...r})}const i=t,{className:u,isTextarea:m,variant:a="outline",typography:d="Subheader",isResizableX:c,isResizableY:S,textareaRowsCount:v,required:p=!1,isError:E=!1,label:g,errorText:q,"aria-invalid":x,type:R,...w}=i,{onWheel:f,onKeyDown:M,...D}=w,_=K(d),F=Z(d),L=E||x===!0||x==="true",y=E?q:void 0,C=R==="number",A=R==="checkbox",W=e=>{if(f==null||f(e),e.defaultPrevented||!C)return;const r=e.currentTarget;document.activeElement===r&&(r.disabled||r.readOnly||e.deltaY!==0&&(e.preventDefault(),e.deltaY<0?r.stepUp():r.stepDown(),r.dispatchEvent(new Event("input",{bubbles:!0})),r.dispatchEvent(new Event("change",{bubbles:!0}))))},V=e=>{if(M==null||M(e),e.defaultPrevented||!C||e.metaKey||e.ctrlKey||e.altKey||de.has(e.key)||/^[0-9]$/.test(e.key))return;const s=e.currentTarget;if(!(e.key==="."&&!s.value.includes("."))){if(e.key==="-"){const o=s.selectionStart??0,k=s.selectionEnd??0,N=s.value.startsWith("-")&&o===0&&k>0;if(o===0&&!N)return}e.preventDefault()}};if(A){const e=n.jsx("input",{type:"checkbox","data-slot":"input","aria-invalid":L?!0:x,className:h("size-4 shrink-0 rounded-sm border border-border bg-background text-primary field-transition","focus-ring-3","aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive","disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",u),onWheel:f,onKeyDown:M,...D});return n.jsxs("div",{className:"w-full space-y-1",children:[g?n.jsxs("label",{htmlFor:w.id,className:h("inline-flex cursor-pointer items-center gap-2",B),children:[e,n.jsxs("span",{className:"inline-flex items-center gap-1",children:[g,p?n.jsx("span",{"aria-hidden":!0,className:"text-cautionary",children:"*"}):null]})]}):e,y?n.jsx("p",{className:"text-sm text-destructive",children:y}):null]})}return n.jsxs("div",{className:"w-full space-y-1",children:[g?n.jsxs("label",{htmlFor:w.id,className:h("inline-flex items-center gap-1",B),children:[g,p?n.jsx("span",{"aria-hidden":!0,className:"text-cautionary",children:"*"}):null]}):null,n.jsx("input",{type:R,"data-slot":"input","aria-invalid":L?!0:x,className:h($,_,F,U[a],"h-9 py-1 resize-none",a==="outline"?"px-3 focus-ring-3":"px-0 focus:outline-none","aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",u),onWheel:W,onKeyDown:V,...D}),y?n.jsx("p",{className:"text-sm text-destructive",children:y}):null]})}const X=({className:t,inputClassName:i,label:u,isRequired:m=!1,isError:a=!1,errorText:d,placeholder:c="Select date",mode:S="single",selectionScope:v="date",value:p,defaultValue:E,onChange:g,isOpen:q,isOpenByDefault:x,onIsOpenChange:R,disabled:w=!1,isLoading:f=!1,popoverComponent:M=Q,calendarComponent:D=te,numberOfMonths:_,name:F,id:L,...y})=>{const C=p!==void 0,[A,W]=b.useState(E),V=f?void 0:C?p:A,e=ae(S),r=ee({mode:e,selectionScope:v,value:V,placeholder:c}),{isOpen:s,setIsOpen:o}=ne({isOpen:q,isOpenByDefault:x},R),k=b.useRef(null),N=b.useRef(null),I=b.useRef(null),P=ce(s,N),j=b.useId(),T=L??j;ue({isOpen:s,rootReference:k,panelReference:I,onDismiss:()=>{o(!1)}});const O=l=>{if(C||W(l),g==null||g(l),e==="single"&&l instanceof Date){o(!1);return}e==="range"&&re(l)&&l.from&&l.to&&o(!1)},Y=l=>{O(l)},z=l=>{O(l)};return n.jsxs("div",{ref:k,className:h("relative w-full space-y-1",t),children:[u?n.jsxs("label",{htmlFor:T,className:"inline-flex items-center gap-1 text-sm font-medium text-foreground",children:[u,m?n.jsx("span",{"aria-hidden":!0,className:"text-cautionary",children:"*"}):null]}):null,n.jsxs("div",{className:"relative flex w-full items-center",children:[n.jsx("input",{ref:N,id:T,name:F,readOnly:!0,value:r,placeholder:c,disabled:w,onClick:()=>o(!0),onFocus:()=>o(!0),className:h("field-transition focus-ring-3 border-border bg-background text-foreground","h-9 w-full rounded-md border py-1 pl-3 pr-10 text-sm outline-none","disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",r===c&&"text-muted-foreground",a&&"border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",i)}),n.jsx("button",{type:"button",tabIndex:-1,disabled:w,onClick:()=>o(!s),className:"absolute right-2 inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground",children:n.jsx(se,{className:"size-4"})})]}),s&&P?n.jsx(M,{children:n.jsx("div",{ref:I,style:{position:"fixed",top:P.top,left:P.left},className:"border-border bg-card text-card-foreground z-50 w-max rounded-md border p-2 shadow-md",children:e==="range"?n.jsx(D,{...y,isLoading:f,selectionScope:v,mode:"range",selected:V,onSelect:z,numberOfMonths:_??2}):n.jsx(D,{...y,isLoading:f,selectionScope:v,mode:"single",selected:V,onSelect:Y,numberOfMonths:_??1})})}):null,a&&d?n.jsx("p",{className:"text-sm text-destructive",children:d}):null]})};X.__docgenInfo={description:"",methods:[],displayName:"InputCalendar",props:{mode:{required:!1,tsType:{name:"union",raw:"'single' | 'range' | 'ranged'",elements:[{name:"literal",value:"'single'"},{name:"literal",value:"'range'"},{name:"literal",value:"'ranged'"}]},description:"",defaultValue:{value:"'single'",computed:!1}},selectionScope:{required:!1,tsType:{name:"union",raw:"'date' | 'month' | 'monthYear'",elements:[{name:"literal",value:"'date'"},{name:"literal",value:"'month'"},{name:"literal",value:"'monthYear'"}]},description:"",defaultValue:{value:"'date'",computed:!1}},value:{required:!1,tsType:{name:"union",raw:"Date | DateRange | undefined",elements:[{name:"Date"},{name:"DateRange"},{name:"undefined"}]},description:""},defaultValue:{required:!1,tsType:{name:"union",raw:"Date | DateRange | undefined",elements:[{name:"Date"},{name:"DateRange"},{name:"undefined"}]},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: CalendarSelectionType) => void",signature:{arguments:[{type:{name:"union",raw:"Date | DateRange | undefined",elements:[{name:"Date"},{name:"DateRange"},{name:"undefined"}]},name:"value"}],return:{name:"void"}}},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Select date'",computed:!1}},isOpen:{required:!1,tsType:{name:"boolean"},description:""},isOpenByDefault:{required:!1,tsType:{name:"boolean"},description:""},onIsOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(isOpen: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"isOpen"}],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},popoverComponent:{required:!1,tsType:{name:"ReactComponentType",raw:"React.ComponentType<{ children: React.ReactNode }>",elements:[{name:"signature",type:"object",raw:"{ children: React.ReactNode }",signature:{properties:[{key:"children",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}}]}}]},description:"",defaultValue:{value:"Popover",computed:!0}},calendarComponent:{required:!1,tsType:{name:"ReactComponentType",raw:"React.ComponentType<CalendarComponentPropertyType>",elements:[{name:"CalendarComponentPropertyType"}]},description:"",defaultValue:{value:`({
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
}`,computed:!1}},label:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},isRequired:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},isError:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},errorText:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},inputClassName:{required:!1,tsType:{name:"string"},description:""},name:{required:!1,tsType:{name:"string"},description:""},id:{required:!1,tsType:{name:"string"},description:""}}};me.__docgenInfo={description:"",methods:[],displayName:"Input"};export{me as I};
