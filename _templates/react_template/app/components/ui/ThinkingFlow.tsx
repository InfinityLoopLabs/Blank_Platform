import React, { type FC, useId, useRef, useState } from 'react'
import { iconsDictionary, type IconKeyType } from '@constants/icons'
import { useClickOutside } from '@infinityloop.labs/utils'

type ThinkingFlowNodeFieldType = 'title' | 'description' | 'hint' | 'icon'

type ThinkingFlowNodeType = {
  id: string
  title: string
  description: string
  hint?: Nullable<string>
  icon?: Nullable<string>
}

type ThinkingFlowNodeChangePayloadType = {
  nodeId: string
  field: ThinkingFlowNodeFieldType
  value: string
}

type ThinkingFlowNodeBlurPayloadType = {
  nodeId: string
  field: ThinkingFlowNodeFieldType
}

type ThinkingFlowPropertyType = {
  title: string
  nodes: ReadonlyArray<ThinkingFlowNodeType>
  activeNode?: Nullable<string>
  onNodeClickHandler?: Callback<Nullable<ThinkingFlowNodeType>>
  isEditMode?: boolean
  isDisabled?: boolean
  titlePlaceholder?: string
  nodeTitlePlaceholder?: string
  nodeDescriptionPlaceholder?: string
  nodeHintPlaceholder?: string
  nodeIconPlaceholder?: string
  onTitleChangeHandler?: Callback<string>
  onTitleBlurHandler?: VoidFunction
  onNodeFieldChangeHandler?: Callback<ThinkingFlowNodeChangePayloadType>
  onNodeFieldBlurHandler?: Callback<ThinkingFlowNodeBlurPayloadType>
  onAddNodeHandler?: VoidFunction
  addNodeLabel?: string
}

const accentPalette = [
  {
    accent: 'var(--neon-main-dim)',
    glow: 'color-mix(in oklab, var(--neon-main-dim) 45%, transparent)',
  },
  {
    accent: 'var(--shani-ember)',
    glow: 'var(--shani-glow)',
  },
  {
    accent: 'var(--neon-main-bright)',
    glow: 'color-mix(in oklab, var(--neon-main-bright) 45%, transparent)',
  },
]

const getAccentByIndex = (index: number) =>
  accentPalette[index % accentPalette.length]

const iconOptions = Object.keys(iconsDictionary) as Array<IconKeyType>

export const ThinkingFlow: FC<ThinkingFlowPropertyType> = ({
  title = 'Title',
  nodes = [],
  activeNode = null,
  onNodeClickHandler,
  isEditMode = false,
  isDisabled = false,
  titlePlaceholder = '',
  nodeTitlePlaceholder = '',
  nodeDescriptionPlaceholder = '',
  nodeHintPlaceholder = '',
  nodeIconPlaceholder = '',
  onTitleChangeHandler,
  onTitleBlurHandler,
  onNodeFieldChangeHandler,
  onNodeFieldBlurHandler,
  onAddNodeHandler,
  addNodeLabel = 'Добавить шаг',
}) => {
  const [localIndex, setLocalIndex] = useState<number>(-1)
  const ref = useRef<HTMLDivElement>(null)
  const iconOptionsListId = useId()

  useClickOutside(ref, () => {
    setLocalIndex(-1)

    if (onNodeClickHandler) {
      onNodeClickHandler(null)
    }
  })

  const activeNodeData = nodes?.find(
    (node, index) => node.id === activeNode || index === localIndex,
  )
  const resolveIconElement = (iconKey?: Nullable<string>) => {
    if (!iconKey) {
      return null
    }

    return iconsDictionary[iconKey as IconKeyType] || null
  }
  const handleNodeFieldChange = (
    nodeId: string,
    field: ThinkingFlowNodeFieldType,
    value: string,
  ) => {
    if (onNodeFieldChangeHandler) {
      onNodeFieldChangeHandler({
        nodeId,
        field,
        value,
      })
    }
  }
  const handleNodeFieldBlur = (
    nodeId: string,
    field: ThinkingFlowNodeFieldType,
  ) => {
    if (onNodeFieldBlurHandler) {
      onNodeFieldBlurHandler({
        nodeId,
        field,
      })
    }
  }

  return (
    <div
      ref={ref}
      className="flat-paper--colored rounded-(--radius) border border-(--shani-ember-dim) p-6 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-(--neon-main) rounded-full animate-pulse" />
        {isEditMode ? (
          <input
            type="text"
            value={title}
            placeholder={titlePlaceholder}
            disabled={isDisabled}
            className="flex-1 rounded-(--radius) border border-(--border) bg-transparent px-3 py-1 text-sm font-mono uppercase tracking-widest text-(--neon-main) outline-none"
            onChange={event => onTitleChangeHandler?.(event.target.value)}
            onBlur={() => onTitleBlurHandler?.()}
          />
        ) : (
          <span className="text-(--neon-main) text-sm font-mono tracking-widest uppercase">
            {title}
          </span>
        )}
      </div>

      <div className="relative">
        {/* Connection lines */}
        <div
          className="absolute top-8 left-8 right-8 h-0.5 opacity-80"
          style={{
            background:
              'linear-gradient(90deg, var(--neon-main-dim), var(--shani-ember), var(--neon-main-bright))',
          }}
        />

        {/* Nodes */}
        <div className="relative flex justify-between">
          {nodes.map((node, index) => {
            const { accent: accentColor, glow: glowColor } =
              getAccentByIndex(index)
            const isActive = activeNode === node.id || localIndex === index
            const iconElement = resolveIconElement(node.icon)

            return (
              <div
                key={node.id}
                onClick={() => {
                  setLocalIndex(index)
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  onNodeClickHandler && onNodeClickHandler(node)
                }}
                className={`
                  relative flex flex-col items-center cursor-pointer
                  transition-all duration-300 group
                  ${isActive ? 'scale-110' : 'hover:scale-105'}
                `}>
                {/* Node circle */}
                <div
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 bg-(--background)"
                  style={{
                    borderColor: accentColor,
                    boxShadow: isActive ? `0 0 20px ${glowColor}` : 'none',
                  }}>
                  <span
                    className="text-2xl font-semibold"
                    style={{ color: accentColor }}>
                    {iconElement ?? node.icon ?? '◉'}
                  </span>
                </div>
                {isEditMode && (
                  <input
                    type="text"
                    value={node.icon || ''}
                    placeholder={nodeIconPlaceholder}
                    disabled={isDisabled}
                    className="mt-2 w-36 rounded-(--radius) border border-(--border) bg-transparent px-2 py-1 text-center text-xs text-(--muted-foreground) outline-none"
                    list={iconOptionsListId}
                    onChange={event =>
                      handleNodeFieldChange(node.id, 'icon', event.target.value)
                    }
                    onBlur={() => handleNodeFieldBlur(node.id, 'icon')}
                  />
                )}

                {/* Label */}
                <div className="mt-3 text-center">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={node.title}
                      placeholder={nodeTitlePlaceholder}
                      disabled={isDisabled}
                      className="w-32 rounded-(--radius) border border-(--border) bg-transparent px-2 py-1 text-center text-xs font-mono uppercase tracking-widest text-(--foreground) outline-none"
                      onChange={event =>
                        handleNodeFieldChange(node.id, 'title', event.target.value)
                      }
                      onBlur={() => handleNodeFieldBlur(node.id, 'title')}
                    />
                  ) : (
                    <div
                      className="text-xs font-mono tracking-widest uppercase"
                      style={{ color: accentColor }}>
                      {node.title}
                    </div>
                  )}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={node.description}
                      placeholder={nodeDescriptionPlaceholder}
                      disabled={isDisabled}
                      className="mt-2 w-40 rounded-(--radius) border border-(--border) bg-transparent px-2 py-1 text-xs text-(--muted-foreground) outline-none"
                      onChange={event =>
                        handleNodeFieldChange(
                          node.id,
                          'description',
                          event.target.value,
                        )
                      }
                      onBlur={() => handleNodeFieldBlur(node.id, 'description')}
                    />
                  ) : (
                    <div
                      className="text-sm font-mono mt-1 transition-colors text-(--muted-foreground)"
                      style={{
                        color: isActive
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                      }}>
                      {node.description}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {isEditMode && (
        <datalist id={iconOptionsListId}>
          {iconOptions.map(option => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}

      {/* Active node content */}
      {activeNodeData && (
        <div
          className="mt-8 p-4 border-l-2 rounded-sm"
          style={{
            borderColor: 'var(--neon-main)',
            background: 'color-mix(in oklab, var(--neon-main) 12%, transparent)',
          }}>
          {isEditMode ? (
            <textarea
              value={activeNodeData.hint || ''}
              placeholder={nodeHintPlaceholder}
              disabled={isDisabled}
              className="w-full rounded-(--radius) border border-(--border) bg-transparent px-3 py-2 text-sm text-(--neon-main-bright) outline-none"
              rows={3}
              onChange={event =>
                handleNodeFieldChange(
                  activeNodeData.id,
                  'hint',
                  event.target.value,
                )
              }
              onBlur={() => handleNodeFieldBlur(activeNodeData.id, 'hint')}
            />
          ) : (
            <p className="text-sm" style={{ color: 'var(--neon-main-bright)' }}>
              {activeNodeData.hint}
            </p>
          )}
        </div>
      )}

      {isEditMode && onAddNodeHandler && (
        <button
          type="button"
          className="mt-6 flex items-center justify-center gap-2 rounded-(--radius) border border-dashed border-(--border) px-4 py-2 text-sm text-(--muted-foreground) transition hover:border-(--neon-main) hover:text-(--neon-main)"
          onClick={() => {
            if (!isDisabled) {
              onAddNodeHandler()
            }
          }}
          disabled={isDisabled}>
          <span className="text-lg leading-none">+</span>
          <span>{addNodeLabel}</span>
        </button>
      )}
    </div>
  )
}
