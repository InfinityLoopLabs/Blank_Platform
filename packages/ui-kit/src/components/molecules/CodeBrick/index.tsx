import { type FC, useEffect, useRef, useState } from 'react'

import { clsx } from '@infinityloop.labs/utils'

import { Dropdown, type DropdownOptionType } from '@/components/atoms/Dropdown'
import { Flex } from '@/components/atoms/Flex'
import { Paper, type PaperPropertyType } from '@/components/atoms/Paper'
import { type TypographyColorType } from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'

type CodeBrickBadSmellType = {
  pattern: string
  message: string
}

export type CodeBrickHintStatusType = 'success' | 'warn' | 'error'

export type CodeBrickHintType = {
  id: string
  value: string
  status: CodeBrickHintStatusType
}

type CodeBrickHintStatusColorsType = {
  success: TypographyColorType
  warn: TypographyColorType
  error: TypographyColorType
}

type CodeBrickCommonPropertyType = {
  title?: string
  onTitleChange?: (value: string) => void
  subtitle?: string
  onSubtitleChange?: (value: string) => void
  hintsLabel?: string
  onHintsLabelChange?: (value: string) => void
  bufferLabel?: string
  onBufferLabelChange?: (value: string) => void
  bufferHelperText?: string
  onBufferHelperTextChange?: (value: string) => void
  hints?: ReadonlyArray<string | CodeBrickHintType>
  hintStatusColors?: Partial<CodeBrickHintStatusColorsType>
  onHintsChange?: (hints: CodeBrickHintType[]) => void
  onHintValueChange?: (index: number, value: string) => void
  onHintStatusChange?: (index: number, status: CodeBrickHintStatusType) => void
  onHintAdd?: (hint: CodeBrickHintType, nextHints: CodeBrickHintType[]) => void
  onHintRemove?: (
    index: number,
    removedHint: CodeBrickHintType,
    nextHints: CodeBrickHintType[],
  ) => void
  activeHintIndex?: number
  onActiveHintIndexChange?: (index: number) => void
  initialCode?: string
  language?: string
  isEditMode?: boolean
  isEditModeDisabled?: boolean
  badSmells?: ReadonlyArray<CodeBrickBadSmellType>
}

type CodeBrickPlaygroundPropertyType = CodeBrickCommonPropertyType

export type CodeBrickSnippetType = {
  id: string
  code: string
  language: string
}

type CodeBrickNormalizedSnippetType = {
  code: string
  language: string
}

export type CodeBrickDraftPropertyType = CodeBrickCommonPropertyType & {
  codeSnippets: CodeBrickSnippetType[]
  activeSnippetId: string
  normalizedCodeSnippets: CodeBrickNormalizedSnippetType[]
  activeSnippet?: CodeBrickSnippetType
  languagePlaceholder?: string
  snippetPlaceholder?: string
  actionButtonLabel?: string
  isCodeBlockLoading?: boolean
  isUpdateCodeBlockLoading?: boolean
  isEditMode?: boolean
  isEditModeDisabled?: boolean
  onAddCodeSnippetTabHandler: VoidFunction
  onRemoveCodeSnippetTabHandler: (snippetId: string) => void
  onSelectCodeSnippetTabHandler: (snippetId: string) => void
  onChangeCodeSnippetValueHandler: (value: string) => void
  onChangeCodeSnippetLanguageHandler: (value: string) => void
  onCreateCodeBlockHandler?: VoidFunction
  onUpdateCodeBlockHandler?: VoidFunction
}

type CodeBrickVariantPropertyType =
  | CodeBrickPlaygroundPropertyType
  | CodeBrickDraftPropertyType

export type CodeBrickPropertyType = CodeBrickVariantPropertyType &
  Omit<PaperPropertyType<'div'>, 'children'>

const EMPTY_HINTS: ReadonlyArray<string | CodeBrickHintType> = []
const EMPTY_BAD_SMELLS: ReadonlyArray<CodeBrickBadSmellType> = []

const isDraftVariant = (
  value: CodeBrickPropertyType,
): value is CodeBrickDraftPropertyType => {
  const hasDraftSnippets =
    'codeSnippets' in value &&
    Array.isArray((value as Partial<CodeBrickDraftPropertyType>).codeSnippets)

  return hasDraftSnippets
}

const normalizeHint = (
  hint: string | CodeBrickHintType,
  fallbackIndex: number,
): CodeBrickHintType => {
  if (typeof hint === 'string') {
    return {
      id: `hint-${fallbackIndex + 1}`,
      value: hint,
      status: 'success',
    }
  }

  return {
    id: hint.id || `hint-${fallbackIndex + 1}`,
    value: hint.value,
    status: hint.status ?? 'success',
  }
}

const normalizeHints = (
  hints: ReadonlyArray<string | CodeBrickHintType>,
): CodeBrickHintType[] => hints.map((hint, index) => normalizeHint(hint, index))

const HINT_STATUS_OPTIONS: DropdownOptionType[] = [
  {
    value: 'success',
    label: 'Success',
  },
  {
    value: 'warn',
    label: 'Warn',
  },
  {
    value: 'error',
    label: 'Error',
  },
]

const isHintStatus = (value: string): value is CodeBrickHintStatusType =>
  value === 'success' || value === 'warn' || value === 'error'

export const Code: FC<CodeBrickPropertyType> = properties => {
  const {
    title = '01 // Code block',
    onTitleChange,
    subtitle = 'Code block',
    onSubtitleChange,
    hintsLabel = 'HINTS',
    onHintsLabelChange,
    bufferLabel = 'BUFFER',
    onBufferLabelChange,
    bufferHelperText = '// Нажми COPY, чтобы скопировать текущую вкладку',
    onBufferHelperTextChange,
    hintStatusColors,
    onHintsChange,
    onHintValueChange,
    onHintStatusChange,
    onHintAdd,
    onHintRemove,
    activeHintIndex: activeHintIndexProperty,
    onActiveHintIndexChange,
    initialCode = '',
    language: baseLanguage = 'javascript',
    isEditMode = true,
    isEditModeDisabled = false,
    hints = EMPTY_HINTS,
    badSmells = EMPTY_BAD_SMELLS,
    className,
    type = 'dark',
    isColored = false,
    isLoading = false,
    ...paperProperty
  } = properties

  const draftProperties = isDraftVariant(properties) ? properties : null
  const draftCodeSnippets = draftProperties?.codeSnippets ?? []
  const draftNormalizedCodeSnippets =
    draftProperties?.normalizedCodeSnippets ?? []
  const draftActiveSnippet = draftProperties?.activeSnippet
  const draftActiveSnippetId = draftProperties?.activeSnippetId ?? ''

  const [playgroundCode, setPlaygroundCode] = useState<string>(initialCode)
  const [isHintsVisible, setIsHintsVisible] = useState<boolean>(false)
  const [activeHintIndexLocal, setActiveHintIndexLocal] = useState<number>(0)
  const [editableHints, setEditableHints] = useState<CodeBrickHintType[]>(
    normalizeHints(hints),
  )
  const [editableTitle, setEditableTitle] = useState<string>(title)
  const [editableSubtitle, setEditableSubtitle] = useState<string>(subtitle)
  const [editableHintsLabel, setEditableHintsLabel] =
    useState<string>(hintsLabel)
  const [editableBufferLabel, setEditableBufferLabel] =
    useState<string>(bufferLabel)
  const [editableBufferHelperText, setEditableBufferHelperText] =
    useState<string>(bufferHelperText)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  )
  const hasPendingChangesRef = useRef(false)
  const nextHintIdRef = useRef(0)
  const copyStatusTimeoutRef = useRef<number | null>(null)

  const codeValue = draftProperties
    ? draftActiveSnippet?.code || ''
    : playgroundCode
  const languageValue = draftProperties
    ? draftActiveSnippet?.language || 'untitled'
    : baseLanguage
  const isEditModeDisabledResolved =
    draftProperties?.isEditModeDisabled ?? isEditModeDisabled
  const isEditModeRequested = draftProperties?.isEditMode ?? isEditMode
  const isEditModeActive =
    isEditModeRequested && !isEditModeDisabledResolved && !isLoading
  const isSnippetsIdle =
    draftProperties !== null ? !draftActiveSnippet?.id : false
  const isInputsDisabled =
    draftProperties !== null
      ? draftProperties.isCodeBlockLoading ||
        draftProperties.isUpdateCodeBlockLoading
      : false
  const isUiLocked = isLoading || isInputsDisabled
  const hasUpdateHandler = Boolean(draftProperties?.onUpdateCodeBlockHandler)
  const isUpdateDisabled =
    draftProperties !== null
      ? draftProperties.isUpdateCodeBlockLoading ||
        draftNormalizedCodeSnippets.length === 0 ||
        !isEditModeActive ||
        !hasUpdateHandler
      : false
  const isTextareaDisabled =
    draftProperties !== null
      ? isUiLocked || !isEditModeActive || isSnippetsIdle
      : isLoading || !isEditModeActive

  const markPendingChanges = () => {
    if (isEditModeActive) {
      hasPendingChangesRef.current = true
    }
  }

  const onAutoSubmit = () => {
    if (
      !draftProperties ||
      !draftProperties.onUpdateCodeBlockHandler ||
      !hasPendingChangesRef.current ||
      isUpdateDisabled
    ) {
      return
    }

    hasPendingChangesRef.current = false
    draftProperties.onUpdateCodeBlockHandler?.()
  }

  const onSelectSnippetHandler = (snippetId: string) => {
    if (!draftProperties) {
      return
    }

    onAutoSubmit()
    draftProperties.onSelectCodeSnippetTabHandler?.(snippetId)
  }

  const onRemoveSnippetHandler = (snippetId: string) => {
    if (!draftProperties) {
      return
    }

    markPendingChanges()
    draftProperties.onRemoveCodeSnippetTabHandler?.(snippetId)
  }

  const onAddSnippetHandler = () => {
    if (!draftProperties) {
      return
    }

    markPendingChanges()
    draftProperties.onAddCodeSnippetTabHandler?.()
  }

  useEffect(() => {
    if (!isEditModeActive) {
      hasPendingChangesRef.current = false
    }
  }, [isEditModeActive])

  useEffect(() => {
    hasPendingChangesRef.current = false
  }, [draftProperties?.activeSnippetId])

  const onTextareaChangeHandler = (value: string) => {
    markPendingChanges()
    if (draftProperties) {
      draftProperties.onChangeCodeSnippetValueHandler?.(value)
    } else {
      setPlaygroundCode(value)
    }
  }

  const copyPayload = draftProperties
    ? draftCodeSnippets.find(snippet => snippet.id === draftActiveSnippetId)
        ?.code || ''
    : codeValue
  const isLanguageEditModeEnabled = isEditModeRequested
  const isLanguageEditModeDisabled =
    isEditModeDisabledResolved || isUiLocked || isSnippetsIdle
  const isTextEditModeEnabled = isEditModeRequested
  const isTextEditModeDisabled = isEditModeDisabledResolved || isUiLocked
  const isSubtitleEditModeEnabled = isEditModeRequested
  const isSubtitleEditModeDisabled = isEditModeDisabledResolved || isUiLocked
  const resolvedHintStatusColors: CodeBrickHintStatusColorsType = {
    success: 'constructive',
    warn: 'cautionary',
    error: 'destructive',
    ...hintStatusColors,
  }
  const hintCount = editableHints.length
  const isActiveHintControlled = activeHintIndexProperty !== undefined
  const activeHintIndexResolved =
    hintCount === 0
      ? 0
      : Math.min(
          Math.max(
            isActiveHintControlled
              ? activeHintIndexProperty
              : activeHintIndexLocal,
            0,
          ),
          hintCount - 1,
        )
  const activeHint = editableHints[activeHintIndexResolved]
  const activeHintColor = activeHint
    ? resolvedHintStatusColors[activeHint.status]
    : resolvedHintStatusColors.success

  const setActiveHintIndexResolved = (nextValue: number) => {
    if (!isActiveHintControlled) {
      setActiveHintIndexLocal(nextValue)
    }
    onActiveHintIndexChange?.(nextValue)
  }

  const updateHints = (nextHints: CodeBrickHintType[]) => {
    setEditableHints(nextHints)
    onHintsChange?.(nextHints)
  }

  const onSelectHintHandler = (index: number) => {
    if (isUiLocked) {
      return
    }
    setActiveHintIndexResolved(index)
  }

  const onAddHintHandler = () => {
    if (!isEditModeActive || isUiLocked) {
      return
    }

    const newHint: CodeBrickHintType = {
      id: `hint-${nextHintIdRef.current + 1}`,
      value: 'Новый hint',
      status: 'success',
    }
    nextHintIdRef.current += 1

    const nextHints = [...editableHints, newHint]
    updateHints(nextHints)
    const nextIndex = nextHints.length - 1
    setActiveHintIndexResolved(nextIndex)
    onHintAdd?.(newHint, nextHints)
  }

  const onRemoveHintHandler = (index: number) => {
    if (!isEditModeActive || isUiLocked || !editableHints[index]) {
      return
    }

    const removedHint = editableHints[index]
    const nextHints = editableHints.filter(
      (_, itemIndex) => itemIndex !== index,
    )
    updateHints(nextHints)

    const nextIndex =
      nextHints.length === 0 ? 0 : Math.min(index, nextHints.length - 1)
    setActiveHintIndexResolved(nextIndex)
    onHintRemove?.(index, removedHint, nextHints)
  }

  const onChangeActiveHintValueHandler = (value: string) => {
    if (!activeHint || isUiLocked) {
      return
    }

    const nextHints = editableHints.map((hint, index) =>
      index === activeHintIndexResolved
        ? {
            ...hint,
            value,
          }
        : hint,
    )
    updateHints(nextHints)
    onHintValueChange?.(activeHintIndexResolved, value)
  }

  const onChangeActiveHintStatusHandler = (status: CodeBrickHintStatusType) => {
    if (!activeHint || isUiLocked) {
      return
    }

    const nextHints = editableHints.map((hint, index) =>
      index === activeHintIndexResolved
        ? {
            ...hint,
            status,
          }
        : hint,
    )
    updateHints(nextHints)
    onHintStatusChange?.(activeHintIndexResolved, status)
  }

  useEffect(() => {
    setEditableTitle(title)
  }, [title])

  useEffect(() => {
    setEditableSubtitle(subtitle)
  }, [subtitle])

  useEffect(() => {
    setEditableHintsLabel(hintsLabel)
  }, [hintsLabel])

  useEffect(() => {
    setEditableBufferLabel(bufferLabel)
  }, [bufferLabel])

  useEffect(() => {
    setEditableBufferHelperText(bufferHelperText)
  }, [bufferHelperText])

  useEffect(() => {
    setEditableHints(normalizeHints(hints))
  }, [hints])

  useEffect(() => {
    nextHintIdRef.current = editableHints.reduce((maximumValue, hint) => {
      const [, idSuffix = '0'] = hint.id.match(/(\d+)$/) ?? []
      const idValue = Number(idSuffix)

      if (Number.isNaN(idValue)) {
        return maximumValue
      }

      return Math.max(maximumValue, idValue)
    }, 0)
  }, [editableHints])

  useEffect(() => {
    if (hintCount === 0) {
      setActiveHintIndexResolved(0)

      return
    }

    if (activeHintIndexResolved > hintCount - 1) {
      setActiveHintIndexResolved(hintCount - 1)
    }
  }, [activeHintIndexResolved, hintCount])

  const onCopyFromBufferHandler = async () => {
    if (isUiLocked) {
      return
    }

    try {
      await navigator.clipboard.writeText(copyPayload)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }

    if (copyStatusTimeoutRef.current !== null) {
      window.clearTimeout(copyStatusTimeoutRef.current)
    }

    copyStatusTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus('idle')
    }, 1400)
  }

  useEffect(
    () => () => {
      if (copyStatusTimeoutRef.current !== null) {
        window.clearTimeout(copyStatusTimeoutRef.current)
      }
    },
    [],
  )

  const detectedSmells = badSmells.filter(smell =>
    codeValue.toLowerCase().includes(smell.pattern.toLowerCase()),
  )
  const codeLineCount = Math.max(codeValue.split('\n').length, 1)
  const codeAreaHeightPx = Math.max(200, codeLineCount * 24 + 32)

  return (
    <Paper
      {...paperProperty}
      type={type}
      isColored={isColored}
      isLoading={isLoading}
      className={clsx('w-full !p-0', className)}>
      <Flex column className="w-full">
        <div className="overflow-hidden rounded-[inherit] border border-(--chart-1)/35 bg-(--chart-1)/10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--chart-1)/30 bg-black px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {draftProperties ? (
                  draftCodeSnippets.map(snippet => {
                    const isActive = snippet.id === draftActiveSnippetId

                    return (
                      <div key={snippet.id} className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectSnippetHandler(snippet.id)}
                          disabled={isUiLocked}
                          className={clsx(
                            'flex cursor-pointer items-center justify-center rounded-full p-1 transition-opacity',
                            !isEditModeActive && 'opacity-60',
                            isUiLocked && 'cursor-not-allowed opacity-60',
                          )}
                          aria-label={snippet.language || 'untitled'}>
                          <span
                            className={clsx(
                              'h-3 w-3 rounded-full border transition-all',
                              isActive
                                ? 'border-(--chart-1) bg-(--chart-1)'
                                : 'border-(--chart-1)/40 bg-(--chart-1)/20',
                            )}
                          />
                        </button>
                        {draftCodeSnippets.length > 1 &&
                        isEditModeActive &&
                        isActive ? (
                          <button
                            type="button"
                            disabled={isUiLocked}
                            className={clsx(
                              'text-xs text-(--muted-foreground)',
                              isUiLocked && 'cursor-not-allowed opacity-60',
                            )}
                            onClick={() => onRemoveSnippetHandler(snippet.id)}>
                            ×
                          </button>
                        ) : null}
                      </div>
                    )
                  })
                ) : (
                  <>
                    <div
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full bg-(--chart-1)/80"
                    />
                    <div
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full bg-(--chart-1)/40"
                    />
                    <div
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full bg-(--chart-1)/20"
                    />
                  </>
                )}
                {draftProperties && isEditModeActive ? (
                  <button
                    type="button"
                    disabled={isUiLocked}
                    className="flex h-4 w-4 items-center justify-center rounded-full border border-dashed border-(--border) text-[10px] text-(--muted-foreground)"
                    onClick={onAddSnippetHandler}>
                    +
                  </button>
                ) : null}
              </div>
              <div className="flex flex-col">
                <EditableTypography
                  typography="Caption"
                  color="chart-1"
                  value={editableTitle}
                  onValueChange={value => {
                    setEditableTitle(value)
                    onTitleChange?.(value)
                  }}
                  className="!h-auto"
                  contentClassName="text-xs font-mono uppercase tracking-widest text-(--chart-1)/75"
                  isLoading={isUiLocked}
                  isEditModeOn={isTextEditModeEnabled ? undefined : false}
                  isEditModeDisabled={isTextEditModeDisabled}
                />
                <EditableTypography
                  typography="CompactCaption"
                  color="muted-foreground"
                  value={editableSubtitle}
                  onValueChange={value => {
                    setEditableSubtitle(value)
                    onSubtitleChange?.(value)
                  }}
                  className="!h-auto"
                  contentClassName="font-mono uppercase tracking-[0.12em]"
                  isLoading={isUiLocked}
                  isEditModeOn={isSubtitleEditModeEnabled ? undefined : false}
                  isEditModeDisabled={isSubtitleEditModeDisabled}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {draftProperties ? (
                <EditableTypography
                  typography="Caption"
                  color="chart-1"
                  value={languageValue}
                  onValueChange={value => {
                    markPendingChanges()
                    draftProperties.onChangeCodeSnippetLanguageHandler?.(value)
                  }}
                  className="w-[280px] max-w-full !h-auto"
                  contentClassName="text-xs font-mono uppercase tracking-widest text-(--chart-1)"
                  placeholder={
                    draftProperties.languagePlaceholder ||
                    'Language (e.g. typescript)'
                  }
                  isLoading={isUiLocked}
                  isEditModeOn={isLanguageEditModeEnabled ? undefined : false}
                  isEditModeDisabled={isLanguageEditModeDisabled}
                  onEditModeChange={nextValue => {
                    if (!nextValue) {
                      onAutoSubmit()
                    }
                  }}
                />
              ) : (
                <span className="text-xs font-mono text-(--chart-1)/40">
                  {`// ${languageValue}`}
                </span>
              )}

              {draftProperties ? (
                <span className="text-xs font-mono text-(--chart-1)/60">
                  SNIPPETS: {draftCodeSnippets.length}
                </span>
              ) : (
                <span className="text-xs font-mono text-(--chart-1)/60">
                  {`// ${languageValue}`}
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-0 top-0 flex w-12 flex-col items-end border-r border-(--chart-1)/30 bg-black/50 pr-2 pt-4 text-xs font-mono text-(--chart-1)/30">
              {codeValue.split('\n').map((_, index) => (
                <div key={`line-${index + 1}`} className="leading-6">
                  {index + 1}
                </div>
              ))}
            </div>
            <textarea
              value={codeValue}
              onChange={event => onTextareaChangeHandler(event.target.value)}
              className={clsx(
                'w-full resize-none overflow-hidden bg-transparent p-4 pl-14 font-mono text-sm leading-6 text-(--muted-foreground) focus:outline-none',
                isTextareaDisabled && 'pointer-events-none opacity-60',
              )}
              placeholder={
                draftProperties?.snippetPlaceholder || 'Paste code snippet'
              }
              spellCheck={false}
              style={{
                tabSize: 2,
                height: codeAreaHeightPx,
              }}
              disabled={isTextareaDisabled}
              onBlur={onAutoSubmit}
            />
          </div>

          {detectedSmells.length > 0 ? (
            <div className="border-t border-red-500/30 bg-red-500/10 px-4 py-2">
              <div className="flex items-center gap-2 text-xs font-mono text-red-400">
                <span>⚠</span>
                <span>CODE SMELL DETECTED:</span>
              </div>
              {detectedSmells.map((smell, index) => (
                <div
                  key={`${smell.pattern}-${index}`}
                  className="mt-1 pl-5 text-xs font-mono text-red-400/80">
                  → {smell.message}
                </div>
              ))}
            </div>
          ) : null}

          {hintCount > 0 || isEditModeActive ? (
            <div className="border-t border-(--chart-1)/30">
              <div className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-mono text-(--chart-1)/60 transition-colors hover:bg-(--chart-1)/5">
                <button
                  type="button"
                  onClick={() => setIsHintsVisible(!isHintsVisible)}
                  className="cursor-pointer"
                  disabled={isUiLocked}>
                  <span>{isHintsVisible ? '▼' : '▶'}</span>
                </button>
                <EditableTypography
                  typography="Caption"
                  color="chart-1"
                  value={editableHintsLabel}
                  onValueChange={value => {
                    setEditableHintsLabel(value)
                    onHintsLabelChange?.(value)
                  }}
                  className="!h-auto !w-auto"
                  contentClassName="text-xs font-mono uppercase tracking-widest text-(--chart-1)/60"
                  isLoading={isUiLocked}
                  isEditModeOn={isTextEditModeEnabled ? undefined : false}
                  isEditModeDisabled={isTextEditModeDisabled}
                />
                <span>({hintCount})</span>
                <div
                  className={clsx(
                    'ml-auto flex h-6 items-center gap-1',
                    !isEditModeActive && 'pointer-events-none opacity-0',
                  )}>
                  <button
                    type="button"
                    onClick={onAddHintHandler}
                    disabled={isUiLocked}
                    aria-label="Add hint"
                    className={clsx(
                      'flex h-6 w-6 items-center justify-center rounded border border-(--chart-1)/40 text-xs font-mono text-(--chart-1)/80',
                      isUiLocked && 'cursor-not-allowed opacity-60',
                    )}>
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveHintHandler(activeHintIndexResolved)}
                    disabled={isUiLocked || hintCount === 0}
                    aria-label="Remove hint"
                    className={clsx(
                      'flex h-6 w-6 items-center justify-center rounded border border-(--chart-1)/25 text-xs font-mono text-(--chart-1)/60',
                      (isUiLocked || hintCount === 0) &&
                        'cursor-not-allowed opacity-60',
                    )}>
                    ×
                  </button>
                </div>
              </div>
              {isHintsVisible ? (
                <div className="px-4 pb-3">
                  <div className="mb-2 flex gap-2">
                    {editableHints.map((hint, index) => (
                      <button
                        key={hint.id}
                        onClick={() => onSelectHintHandler(index)}
                        disabled={isUiLocked}
                        className={clsx(
                          'h-6 w-6 border text-xs font-mono transition-all',
                          index === activeHintIndexResolved
                            ? 'border-(--chart-1) bg-(--chart-1)/20 text-(--chart-1)'
                            : 'border-(--chart-1)/30 text-(--chart-1)/50 hover:border-(--chart-1)/60',
                        )}>
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  {activeHint ? (
                    <div className="mb-2 min-h-11">
                      <div
                        className={clsx(
                          'max-w-[180px]',
                          !isEditModeActive && 'pointer-events-none opacity-0',
                        )}>
                        <Dropdown
                          type="default"
                          options={HINT_STATUS_OPTIONS}
                          value={activeHint.status}
                          placeholder="Color"
                          disabled={isUiLocked || !isEditModeActive}
                          onValueChange={value => {
                            if (!isHintStatus(value)) {
                              return
                            }
                            onChangeActiveHintStatusHandler(value)
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                  {activeHint ? (
                    <div
                      className="border-l-2 bg-black/15 p-3 font-mono text-sm"
                      style={{
                        borderColor: `var(--${activeHintColor})`,
                        color: `var(--${activeHintColor})`,
                      }}>
                      <EditableTypography
                        typography="BodySmall"
                        color={activeHintColor}
                        value={activeHint.value}
                        onValueChange={onChangeActiveHintValueHandler}
                        className="!h-auto"
                        contentClassName="font-mono"
                        isLoading={isUiLocked}
                        isEditModeOn={isTextEditModeEnabled ? undefined : false}
                        isEditModeDisabled={isTextEditModeDisabled}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="border-t border-(--chart-1)/30">
            <div className="flex items-center justify-between bg-black/50 px-4 py-2">
              <EditableTypography
                typography="Caption"
                color="chart-1"
                value={editableBufferLabel}
                onValueChange={value => {
                  setEditableBufferLabel(value)
                  onBufferLabelChange?.(value)
                }}
                className="!h-auto !w-auto"
                contentClassName="text-xs font-mono uppercase tracking-widest text-(--chart-1)/60"
                isLoading={isUiLocked}
                isEditModeOn={isTextEditModeEnabled ? undefined : false}
                isEditModeDisabled={isTextEditModeDisabled}
              />
              <button
                onClick={onCopyFromBufferHandler}
                disabled={
                  isUiLocked || (draftProperties ? isSnippetsIdle : false)
                }
                className={clsx(
                  'px-4 py-1.5 font-mono text-sm transition-all',
                  copyStatus === 'copied'
                    ? 'bg-green-500/20 text-green-300'
                    : copyStatus === 'error'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-(--chart-1) text-black hover:brightness-110',
                )}>
                {copyStatus === 'copied'
                  ? 'COPIED'
                  : copyStatus === 'error'
                    ? 'COPY ERROR'
                    : 'COPY'}
              </button>
            </div>
            <div className="min-h-[80px] p-4 font-mono text-sm">
              <EditableTypography
                typography="BodySmall"
                color="chart-1"
                value={editableBufferHelperText}
                onValueChange={value => {
                  setEditableBufferHelperText(value)
                  onBufferHelperTextChange?.(value)
                }}
                className="!h-auto"
                contentClassName="font-mono text-(--chart-1)/30"
                isLoading={isUiLocked}
                isEditModeOn={isTextEditModeEnabled ? undefined : false}
                isEditModeDisabled={isTextEditModeDisabled}
              />
            </div>
          </div>
        </div>
      </Flex>
    </Paper>
  )
}

export const CodeBrick = Code
