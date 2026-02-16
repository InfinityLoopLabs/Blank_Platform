import React, { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { ArrayRender, clsx } from '@infinityloop.labs/utils'

// Типизация функций всегда через Callback<Value, ReturnType> или VoidFunction.
// Value — тип аргумента, ReturnType — тип возврата, по умолчанию void.
// VoidFunction — без аргументов и возвращаемого значения.
//
// Без React.memo - используется react compiler
//
// Комментирование вёрстки: {/* Описание: Начало */} <Flex> </Flex> {/* Описание: Конец */}.
// Комментировать только логические блоки, не каждую строку.
// Старые комментарии не удалять — обновлять только при изменении структуры блока.
//
// Для отображения массивов использовать только ArrayRender. import { ArrayRender } from "@infinityloop.labs/utils"
// Принимает items (массив элементов) и renderItem={(item=><JSX key={item.id} /> /)}
// Исключение — случаи, когда библиотека требует прямой map-рендер (например, слайдеры или карусели).
//
// В className использовать clsx import { clsx } from "@infinityloop.labs/utils"
//
//
// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы; булевы с префиксами is/has/should/can.
// Функции именовать on***Handler.
// Полные осмысленные имена переменных и функций.
// Запрещено: использовать useCallback/useMemo React.memo - это делает react compiler

// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
//
// Вместо || null использовать Nullable<%Type%> который ипортируется из Global
// Вместо классов flex flex-col использовать компонент <Flex> у него есть поля
//     column?: boolean;
//     middle?: boolean <- Сделать по центру
//     'justify-content'?: JustifyContentType;
//     'align-items'?: AlignItemsType;

type CodeArenaBadSmellType = {
  pattern: string
  message: string
}

type CodeArenaRunPayloadType = {
  code: string
  result: string
  attempts: number
}

type CodeBrickCommonPropertyType = {
  title?: string
  subtitle?: string
  initialCode?: string
  language?: string
  hints?: ReadonlyArray<string>
  badSmells?: ReadonlyArray<CodeArenaBadSmellType>
  expectedOutput?: Nullable<string>
  onRun?: Callback<CodeArenaRunPayloadType>
}

type CodeArenaPropertyType = CodeBrickCommonPropertyType & {
  variant?: 'playground'
}

type CodeBrickSnippetType = {
  id: string
  code: string
  language: string
}

type CodeBrickNormalizedSnippetType = {
  code: string
  language: string
}

export type CodeBrickDraftPropertyType = CodeBrickCommonPropertyType & {
  variant: 'draft'
  codeSnippets: CodeBrickSnippetType[]
  activeSnippetId: string
  normalizedCodeSnippets: CodeBrickNormalizedSnippetType[]
  activeSnippet?: CodeBrickSnippetType
  languagePlaceholder?: string
  snippetPlaceholder?: string
  actionButtonLabel?: string
  showPreview?: boolean
  isCodeBlockLoading?: boolean
  isUpdateCodeBlockLoading?: boolean
  isEditMode?: boolean
  actionMode?: 'auto' | 'create' | 'update' | 'none'
  onAddCodeSnippetTabHandler: VoidFunction
  onRemoveCodeSnippetTabHandler: Callback<string>
  onSelectCodeSnippetTabHandler: Callback<string>
  onChangeCodeSnippetValueHandler: Callback<string>
  onChangeCodeSnippetLanguageHandler: Callback<string>
  onCreateCodeBlockHandler?: VoidFunction
  onUpdateCodeBlockHandler?: VoidFunction
}

type CodeBrickPropertyType = CodeArenaPropertyType | CodeBrickDraftPropertyType

const DEFAULT_PREVIEW_SNIPPET: CodeBrickNormalizedSnippetType = {
  code: '/* code snippet */',
  language: 'plaintext',
}

const isDraftVariant = (
  value: CodeBrickPropertyType,
): value is CodeBrickDraftPropertyType => value.variant === 'draft'

export const CodeBrick: FC<CodeBrickPropertyType> = properties => {
  const {
    title: _title = '01 // Code block',
    subtitle: _subtitle = ' Code block',
    initialCode = '',
    language: baseLanguage = 'javascript',
    hints = [],
    badSmells = [],
    onRun,
    expectedOutput = null,
  } = properties

  const draftProperties = isDraftVariant(properties) ? properties : null

  const [playgroundCode, setPlaygroundCode] = useState<string>(initialCode)
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [showHints, setShowHints] = useState<boolean>(false)
  const [activeHint, setActiveHint] = useState<number>(0)
  const [attempts, setAttempts] = useState<number>(0)
  const [isCorrect, setIsCorrect] = useState<Nullable<boolean>>(null)
  const hasPendingChangesRef = useRef(false)

  const codeValue = draftProperties
    ? draftProperties.activeSnippet?.code || ''
    : playgroundCode
  const languageValue = draftProperties
    ? draftProperties.activeSnippet?.language || 'untitled'
    : baseLanguage
  const isRunSupported =
    (languageValue || '').trim().toLowerCase() === 'javascript'
  const normalizedPreview =
    draftProperties && draftProperties.normalizedCodeSnippets.length > 0
      ? draftProperties.normalizedCodeSnippets
      : [DEFAULT_PREVIEW_SNIPPET]
  const isEditModeActive = draftProperties?.isEditMode ?? true
  const isSnippetsIdle =
    draftProperties !== null
      ? !isEditModeActive || !draftProperties.activeSnippet?.id
      : false
  const areInputsDisabled =
    draftProperties !== null
      ? draftProperties.isCodeBlockLoading ||
        draftProperties.isUpdateCodeBlockLoading ||
        !isEditModeActive
      : false
  const hasCreateHandler = Boolean(draftProperties?.onCreateCodeBlockHandler)
  const hasUpdateHandler = Boolean(draftProperties?.onUpdateCodeBlockHandler)
  const isCreateDisabled =
    draftProperties !== null
      ? draftProperties.isCodeBlockLoading ||
        draftProperties.normalizedCodeSnippets.length === 0 ||
        !isEditModeActive ||
        !hasCreateHandler
      : false
  const isUpdateDisabled =
    draftProperties !== null
      ? draftProperties.isUpdateCodeBlockLoading ||
          draftProperties.normalizedCodeSnippets.length === 0 ||
          !isEditModeActive ||
          !hasUpdateHandler
      : false
  const isTextareaDisabled =
    draftProperties !== null ? areInputsDisabled || isSnippetsIdle : false
  const actionMode = draftProperties?.actionMode ?? 'auto'
  const resolvedActionType =
    actionMode === 'none'
      ? null
      : actionMode === 'create'
        ? 'create'
        : actionMode === 'update'
          ? 'update'
          : isEditModeActive
            ? 'update'
            : 'create'
  const markPendingChanges = () => {
    if (draftProperties?.isEditMode) {
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
    draftProperties.onUpdateCodeBlockHandler()
  }
  const onSelectSnippetHandler = (snippetId: string) => {
    if (!draftProperties) {
      return
    }

    onAutoSubmit()
    draftProperties.onSelectCodeSnippetTabHandler(snippetId)
  }
  const onRemoveSnippetHandler = (snippetId: string) => {
    if (!draftProperties) {
      return
    }

    markPendingChanges()
    draftProperties.onRemoveCodeSnippetTabHandler(snippetId)
  }
  const onAddSnippetHandler = () => {
    if (!draftProperties) {
      return
    }

    markPendingChanges()
    draftProperties.onAddCodeSnippetTabHandler()
  }
  useEffect(() => {
    if (!draftProperties?.isEditMode) {
      hasPendingChangesRef.current = false
    }
  }, [draftProperties?.isEditMode])
  useEffect(() => {
    hasPendingChangesRef.current = false
  }, [draftProperties?.activeSnippetId])

  const onTextareaChangeHandler = (value: string) => {
    markPendingChanges()
    if (draftProperties) {
      draftProperties.onChangeCodeSnippetValueHandler(value)
    } else {
      setPlaygroundCode(value)
    }
  }

  // Запускает выполнение пользовательского кода и проверяет ожидаемый вывод
  const runCode = async (): Promise<void> => {
    setIsRunning(true)
    setAttempts(prev => prev + 1)

    // Simulate execution
    await new Promise(r => setTimeout(r, 800))

    try {
      // Simple eval for demo (in production use sandboxed execution)
      let result: string
      if ((languageValue || '').toLowerCase() === 'javascript') {
        const logs: string[] = []
        const mockConsole = {
          log: (...args: Array<unknown>) => {
            logs.push(args.map(value => String(value)).join(' '))
          },
        }
        const fn = new Function('console', codeValue)
        fn(mockConsole)
        result = logs.join('\n') || 'undefined'
      } else {
        result = `// Output simulation for ${languageValue}`
      }

      setOutput(result)

      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        setIsCorrect(true)
      } else if (expectedOutput) {
        setIsCorrect(false)
      }

      // Сообщаем контейнеру о результатах выполнения
      if (onRun) {
        onRun({
          code: codeValue,
          result,
          attempts: attempts + 1,
        })
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      setOutput(`Error: ${errorMessage}`)
      setIsCorrect(false)
    }

    setIsRunning(false)
  }

  // Ищем совпадения паттернов smell в текущем коде
  const detectedSmells = badSmells.filter(smell =>
    codeValue.toLowerCase().includes(smell.pattern.toLowerCase()),
  )

  return (
    <Flex column className="w-full">
      <div className="bg-(--shani-ember-dim)/15 border border-(--shani-ember-dim) rounded-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-black border-b border-(--shani-ember-dim)/40">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {draftProperties ? (
                <ArrayRender
                  items={draftProperties.codeSnippets}
                  renderItem={(snippet: CodeBrickSnippetType) => {
                    const isActive =
                      snippet.id === draftProperties.activeSnippetId

                    return (
                      <div key={snippet.id} className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectSnippetHandler(snippet.id)}
                          className={clsx(
                            'flex items-center justify-center rounded-full p-1 transition-opacity cursor-pointer',
                            !isEditModeActive && 'opacity-60',
                          )}
                          aria-label={snippet.language || 'untitled'}>
                          <span
                            className={clsx(
                              'h-3 w-3 rounded-full border transition-all',
                              isActive
                                ? 'border-(--neon-main) bg-(--neon-main)'
                                : 'border-(--neon-main)/40 bg-(--neon-main)/20',
                            )}
                          />
                        </button>
                        {draftProperties.codeSnippets.length > 1 &&
                          isEditModeActive &&
                          isActive && (
                            <button
                              type="button"
                              className="text-(--muted-foreground) text-xs"
                              onClick={() => onRemoveSnippetHandler(snippet.id)}>
                              ×
                            </button>
                          )}
                      </div>
                    )
                  }}
                />
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-(--neon-main)/80" />
                  <div className="w-3 h-3 rounded-full bg-(--neon-main)/40" />
                  <div className="w-3 h-3 rounded-full bg-(--neon-main)/20" />
                </>
              )}
              {draftProperties && isEditModeActive && (
                <button
                  type="button"
                  className="flex h-4 w-4 items-center justify-center rounded-full border border-dashed border-(--border) text-[10px] text-(--muted-foreground)"
                  onClick={onAddSnippetHandler}>
                  +
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {draftProperties ? (
              <input
                type="text"
                value={languageValue}
                onChange={event => {
                  markPendingChanges()
                  draftProperties.onChangeCodeSnippetLanguageHandler(
                    event.target.value,
                  )
                }}
                className="rounded-(--radius) border border-(--neon-main)/30 bg-transparent px-2 py-1 text-xs font-mono uppercase tracking-widest text-(--neon-main) outline-none"
                placeholder={
                  draftProperties.languagePlaceholder ||
                  'Language (e.g. typescript)'
                }
                disabled={areInputsDisabled || isSnippetsIdle}
                onBlur={onAutoSubmit}
              />
            ) : (
              // eslint-disable-next-line react/jsx-no-comment-textnodes
              <span className="text-(--neon-main)/40 text-xs font-mono">
                // {languageValue}
              </span>
            )}
            <span className="text-(--neon-main)/60 text-xs font-mono">
              ATTEMPTS: {attempts}
            </span>
            {isCorrect !== null && (
              <span
                className={`text-xs font-mono ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? '✓ PASSED' : '✗ FAILED'}
              </span>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/50 border-r border-(--shani-ember-dim)/40 flex flex-col items-end pr-2 pt-4 text-(--neon-main)/30 text-xs font-mono">
            {codeValue.split('\n').map((_, index) => (
              <div key={index} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>
          <textarea
            value={codeValue}
            onChange={event => onTextareaChangeHandler(event.target.value)}
            className={clsx(
              'w-full min-h-[200px] bg-transparent text-(--shani-ember-soft) font-mono text-sm p-4 pl-14 focus:outline-none resize-none leading-6',
              isTextareaDisabled && 'opacity-60 pointer-events-none',
            )}
            placeholder={
              draftProperties?.snippetPlaceholder || 'Paste code snippet'
            }
            spellCheck={false}
            style={{ tabSize: 2 }}
            disabled={isTextareaDisabled}
            onBlur={onAutoSubmit}
          />
        </div>

        {/* Bad Smells Warning */}
        {detectedSmells.length > 0 && (
          <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/30">
            <div className="text-red-400 text-xs font-mono flex items-center gap-2">
              <span>⚠</span>
              <span>CODE SMELL DETECTED:</span>
            </div>
            {detectedSmells.map((smell, index) => (
              <div
                key={index}
                className="text-red-400/80 text-xs font-mono mt-1 pl-5">
                → {smell.message}
              </div>
            ))}
          </div>
        )}

        {/* Hints */}
        {hints.length > 0 && (
          <div className="border-t border-(--shani-ember-dim)/30">
            <button
              onClick={() => setShowHints(!showHints)}
              className="w-full px-4 py-2 text-left text-(--neon-main)/60 text-xs font-mono hover:bg-(--shani-ember)/5 transition-colors flex items-center gap-2">
              <span>{showHints ? '▼' : '▶'}</span>
              <span>HINTS ({hints.length})</span>
            </button>
            {showHints && (
              <div className="px-4 pb-3">
                <div className="flex gap-2 mb-2">
                  {hints.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveHint(index)}
                      className={`w-6 h-6 text-xs font-mono border transition-all ${
                        index === activeHint
                          ? 'border-(--neon-main) text-(--neon-main) bg-(--neon-main)/20'
                          : 'border-(--neon-main)/30 text-(--neon-main)/50 hover:border-(--neon-main)/60'
                      }`}>
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="text-(--shani-ember)/80 text-sm font-mono p-3 bg-(--shani-ember)/5 border-l-2 border-(--shani-ember)/50">
                  {hints[activeHint]}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Output */}
        <div className="border-t border-(--shani-ember-dim)/30">
          <div className="px-4 py-2 bg-black/50 flex items-center justify-between">
            <span className="text-(--neon-main)/60 text-xs font-mono">OUTPUT</span>
            {isRunSupported ? (
              <button
                onClick={runCode}
                disabled={isRunning || (draftProperties ? isSnippetsIdle : false)}
                className={`px-4 py-1.5 font-mono text-sm transition-all ${
                  isRunning
                    ? 'bg-(--neon-main)/20 text-(--neon-main)/50'
                    : 'bg-(--neon-main) text-black hover:bg-(--neon-main-bright)'
                }`}>
                {isRunning ? 'RUNNING...' : 'RUN ▶'}
              </button>
            ) : null}
          </div>
          <div className="p-4 min-h-[80px] font-mono text-sm">
            {output ? (
              <pre
                className={`${
                  isCorrect === false
                    ? 'text-red-400'
                    : isCorrect === true
                      ? 'text-green-400'
                      : 'text-(--shani-ember-soft)'
                }`}>
                {output}
              </pre>
            ) : (
              <span className="text-(--neon-main)/30">
                {isRunSupported
                  ? '// Нажми RUN, чтобы выполнить код'
                  : '// Запуск доступен только для JavaScript'}
              </span>
            )}
          </div>
        </div>
        {draftProperties && (
          <>
            {draftProperties.isUpdateCodeBlockLoading && (
              <div className="border-t border-(--shani-ember-dim)/30 bg-black/40 px-4 py-3">
                <span className="text-xs font-mono uppercase tracking-widest text-(--muted-foreground)">
                  {draftProperties.actionButtonLabel ||
                    (resolvedActionType === 'create'
                      ? 'Create code block'
                      : 'Update block')}
                </span>
              </div>
            )}
            {draftProperties.showPreview && (
              <div className="border-t border-(--shani-ember-dim)/30 bg-black/60 px-4 py-3">
                <pre className="text-xs text-(--muted-foreground)">
                  {JSON.stringify(normalizedPreview, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </Flex>
  )
}
