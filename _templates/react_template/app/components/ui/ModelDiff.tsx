import { useMemo, useState } from 'react'
import type { FC } from 'react'

type ModelDiffViewModeType = 'split' | 'unified'

type ModelDiffPropertyType = {
  title?: string
  before: string
  after: string
  beforeLine?: number | null
  afterLine?: number | null
  viewMode?: ModelDiffViewModeType
  defaultViewMode?: ModelDiffViewModeType
  onViewModeChange?: Callback<ModelDiffViewModeType>
  isEditMode?: boolean
  isSubmitting?: boolean
  onTitleChange?: Callback<string>
  onBeforeChange?: Callback<string>
  onAfterChange?: Callback<string>
  onBeforeLineChange?: Callback<string>
  onAfterLineChange?: Callback<string>
  onAutoSave?: VoidFunction
}

const formatLineNumber = (lineIndex: number): number => lineIndex + 1
const resolveLineDisplay = (value?: number | null): string =>
  typeof value === 'number' ? `${value}` : '—'

export const ModelDiff: FC<ModelDiffPropertyType> = ({
  title,
  before,
  after,
  beforeLine,
  afterLine,
  viewMode,
  defaultViewMode = 'split',
  onViewModeChange,
  isEditMode = false,
  isSubmitting = false,
  onTitleChange,
  onBeforeChange,
  onAfterChange,
  onBeforeLineChange,
  onAfterLineChange,
  onAutoSave,
}) => {
  const [internalViewMode, setInternalViewMode] =
    useState<ModelDiffViewModeType>(defaultViewMode)
  const isViewModeControlled = viewMode !== undefined
  const resolvedViewMode =
    (isViewModeControlled ? viewMode : internalViewMode) ?? 'split'
  const resolvedTitle = title && title.trim().length > 0 ? title : 'MODEL DIFF'
  const beforeLines = useMemo(() => before.split('\n'), [before])
  const afterLines = useMemo(() => after.split('\n'), [after])

  const handleAutoSave = () => {
    if (isSubmitting) {
      return
    }

    onAutoSave?.()
  }

  const handleViewModeChange = (mode: ModelDiffViewModeType) => {
    if (!isViewModeControlled) {
      setInternalViewMode(mode)
    }

    onViewModeChange?.(mode)
  }

  const resolveLineHighlightClass = (isActive: boolean): string =>
    isActive ? 'bg-(--shani-ember)/10 border-l-2 border-(--shani-ember)' : ''

  const renderSplitView = (): JSX.Element => (
    <div className="grid grid-cols-2 divide-x divide-(--shani-ember-dim)/30">
      {[
        {
          label: 'BEFORE',
          lines: beforeLines,
          highlightIndex: typeof beforeLine === 'number' ? beforeLine : null,
        },
        {
          label: 'AFTER',
          lines: afterLines,
          highlightIndex: typeof afterLine === 'number' ? afterLine : null,
        },
      ].map(({ label, lines, highlightIndex }) => (
        <div key={label} className="overflow-x-auto">
          <div className="px-4 py-2 bg-black/40 border-b border-(--shani-ember-dim)/40 flex items-center justify-between">
            <span className="text-(--neon-main)/60 text-xs font-mono">
              {label}
            </span>
            <span className="text-(--shani-ember-soft)/70 text-xs font-mono">
              {lines.length} lines
            </span>
          </div>
          <pre className="p-4 text-sm font-mono">
            {lines.map((line, index) => (
              <div
                key={`${label}-${index}`}
                className={`flex items-start gap-2 py-0.5 ${resolveLineHighlightClass(index === highlightIndex)}`}>
                <span className="w-10 text-right px-2 select-none text-(--muted-foreground)/70">
                  {formatLineNumber(index)}
                </span>
                <span className="flex-1 text-white">
                  {line.length > 0 ? line : ' '}
                </span>
              </div>
            ))}
          </pre>
        </div>
      ))}
    </div>
  )

  const renderUnifiedView = (): JSX.Element => {
    const unifiedItems = [
      ...beforeLines.map((line, index) => ({
        marker: '-',
        content: line,
        line: index,
        isHighlight:
          typeof beforeLine === 'number' ? beforeLine === index : false,
      })),
      ...afterLines.map((line, index) => ({
        marker: '+',
        content: line,
        line: index,
        isHighlight:
          typeof afterLine === 'number' ? afterLine === index : false,
      })),
    ]

    return (
      <div className="overflow-x-auto">
        <pre className="text-sm font-mono">
          {unifiedItems.map(item => (
            <div
              key={`${item.marker}-${item.line}-${item.content}`}
              className={`flex gap-2 px-2 ${resolveLineHighlightClass(item.isHighlight)}`}>
              <span className="w-6 text-center select-none text-(--muted-foreground)/70">
                {item.marker}
              </span>
              <span className="w-10 text-right select-none text-(--muted-foreground)/70">
                {formatLineNumber(item.line)}
              </span>
              <span className="flex-1 text-white">
                {item.content.length > 0 ? item.content : ' '}
              </span>
            </div>
          ))}
        </pre>
      </div>
    )
  }

  return (
    <div className="bg-(--shani-ember-dim)/15 border border-(--shani-ember-dim) rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-black border-b border-(--shani-ember-dim)/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-(--neon-main) text-lg">◐</span>
          {isEditMode && onTitleChange ? (
            <input
              type="text"
              value={title ?? ''}
              placeholder="Model diff title"
              className="rounded-(--radius) border border-(--border) bg-transparent px-2 py-1 text-sm text-white outline-none"
              onChange={event => onTitleChange(event.target.value)}
              onBlur={handleAutoSave}
              disabled={isSubmitting}
            />
          ) : (
            <span className="text-(--shani-ember-soft) text-sm font-mono">
              {resolvedTitle}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handleViewModeChange('split')}
            className={`px-3 py-1 text-xs font-mono border transition-colors ${
              resolvedViewMode === 'split'
                ? 'border-(--neon-main) bg-(--neon-main)/20 text-(--neon-main)'
                : 'border-(--shani-ember-dim)/40 text-(--muted-foreground) hover:text-(--neon-main)'
            }`}>
            SPLIT
          </button>
          <button
            onClick={() => handleViewModeChange('unified')}
            className={`px-3 py-1 text-xs font-mono border transition-colors ${
              resolvedViewMode === 'unified'
                ? 'border-(--neon-main) bg-(--neon-main)/20 text-(--neon-main)'
                : 'border-(--shani-ember-dim)/40 text-(--muted-foreground) hover:text-(--neon-main)'
            }`}>
            UNIFIED
          </button>
        </div>
      </div>

      {isEditMode && (
        <div className="px-4 py-4 bg-black/40 border-b border-(--shani-ember-dim)/30 flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                Before code
              </span>
              <textarea
                value={before}
                placeholder="Paste old code"
                className="min-h-[160px] rounded-(--radius) border border-(--border) bg-black/30 p-3 font-mono text-sm text-white outline-none"
                onChange={event => onBeforeChange?.(event.target.value)}
                onBlur={handleAutoSave}
                disabled={isSubmitting || !onBeforeChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                After code
              </span>
              <textarea
                value={after}
                placeholder="Paste new code"
                className="min-h-[160px] rounded-(--radius) border border-(--border) bg-black/30 p-3 font-mono text-sm text-white outline-none"
                onChange={event => onAfterChange?.(event.target.value)}
                onBlur={handleAutoSave}
                disabled={isSubmitting || !onAfterChange}
              />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-(--muted-foreground)">
                Before line (0-based)
              </label>
              <input
                type="number"
                min={0}
                value={typeof beforeLine === 'number' ? beforeLine : ''}
                className="rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-white outline-none"
                onChange={event => onBeforeLineChange?.(event.target.value)}
                onBlur={handleAutoSave}
                disabled={isSubmitting || !onBeforeLineChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-(--muted-foreground)">
                After line (0-based)
              </label>
              <input
                type="number"
                min={0}
                value={typeof afterLine === 'number' ? afterLine : ''}
                className="rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-white outline-none"
                onChange={event => onAfterLineChange?.(event.target.value)}
                onBlur={handleAutoSave}
                disabled={isSubmitting || !onAfterLineChange}
              />
            </div>
          </div>
          {onAutoSave && (
            <span className="text-xs text-(--muted-foreground)">
              Changes are saved automatically on blur.
            </span>
          )}
        </div>
      )}

      {resolvedViewMode === 'split' ? renderSplitView() : renderUnifiedView()}
    </div>
  )
}
