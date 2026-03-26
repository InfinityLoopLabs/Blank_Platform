import { useEffect, useRef, useState } from 'react'
import type { Meta } from '@storybook/react-vite'

import {
  Code,
  type CodeBrickHintType,
  type CodeBrickPropertyType,
  type CodeBrickSnippetType,
} from '@/components/molecules/CodeBrick'

const initialDraftSnippets: CodeBrickSnippetType[] = [
  {
    id: 'snippet-1',
    language: 'javascript',
    code: "console.log('hello from draft #1')",
  },
  {
    id: 'snippet-2',
    language: 'zedmod',
    code: 'export const mode = "zedmod"',
  },
  {
    id: 'snippet-3',
    language: 'zloading',
    code: 'const isLoading = true',
  },
]

const initialDraftHints: CodeBrickHintType[] = [
  {
    id: 'hint-1',
    value: 'Используй console.log() чтобы вывести строку.',
    status: 'success',
  },
  {
    id: 'hint-2',
    value: 'Проверь регистр символов в итоговой строке.',
    status: 'warn',
  },
  {
    id: 'hint-3',
    value: 'Сравнение идет строго по trimmed output.',
    status: 'error',
  },
]

const createNormalizedPreview = (snippets: CodeBrickSnippetType[]) =>
  snippets.map(snippet => ({
    code: snippet.code,
    language: snippet.language,
  }))

const normalizeStoryHints = (
  value: unknown,
  fallbackHints: CodeBrickHintType[],
): CodeBrickHintType[] => {
  if (!Array.isArray(value)) {
    return fallbackHints
  }

  return value.map((hint, index) => {
    if (typeof hint === 'string') {
      return {
        id: `hint-${index + 1}`,
        value: hint,
        status: 'success',
      }
    }

    const hintValue = hint as Partial<CodeBrickHintType>

    return {
      id: hintValue.id || `hint-${index + 1}`,
      value: hintValue.value || '',
      status: hintValue.status || 'success',
    }
  })
}

const meta = {
  title: 'Molecules/Code',
  component: Code,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-[920px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Code',
    subtitle: 'Interactive code surface',
    initialCode: "console.log('Infinity Loop')",
    language: 'javascript',
    isEditMode: true,
    isEditModeDisabled: false,
    hints: initialDraftHints,
    hintStatusColors: {
      success: 'constructive',
      warn: 'cautionary',
      error: 'destructive',
    },
    badSmells: [
      {
        pattern: 'eval(',
        message: 'Avoid eval in user code.',
      },
      {
        pattern: 'while(true)',
        message: 'Potential infinite loop detected.',
      },
    ],
    type: 'dark',
    isColored: false,
    isRoundedCornersDisabled: false,
    isLoading: false,
  },
  argTypes: {
    title: {
      control: 'text',
    },
    subtitle: {
      control: 'text',
    },
    initialCode: {
      control: 'text',
    },
    language: {
      control: 'text',
    },
    hints: {
      control: 'object',
    },
    hintStatusColors: {
      control: 'object',
    },
    badSmells: {
      control: 'object',
    },
    type: {
      control: 'select',
      options: ['dark', 'light', 'glass', 'transparent'],
    },
    isGradientEnabled: {
      control: 'boolean',
    },
    isColored: {
      control: 'boolean',
    },
    isRoundedCornersDisabled: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    isEditMode: {
      control: 'boolean',
    },
    isEditModeDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta

export default meta

export const Debug = {
  render: (args: CodeBrickPropertyType) => {
    const [snippets, setSnippets] =
      useState<CodeBrickSnippetType[]>(initialDraftSnippets)
    const [activeSnippetId, setActiveSnippetId] = useState<string>(
      initialDraftSnippets[0]?.id || '',
    )
    const [titleValue, setTitleValue] = useState<string>(
      String(args.title ?? ''),
    )
    const [subtitleValue, setSubtitleValue] = useState<string>(
      String(args.subtitle ?? ''),
    )
    const [hintsLabelValue, setHintsLabelValue] = useState<string>(
      String(args.hintsLabel ?? 'HINTS'),
    )
    const [bufferLabelValue, setBufferLabelValue] = useState<string>(
      String(args.bufferLabel ?? 'BUFFER'),
    )
    const [bufferHelperTextValue, setBufferHelperTextValue] = useState<string>(
      String(
        args.bufferHelperText ??
          '// Нажми COPY, чтобы скопировать текущую вкладку',
      ),
    )
    const [hintsValue, setHintsValue] = useState<CodeBrickHintType[]>(
      normalizeStoryHints(args.hints, initialDraftHints),
    )
    const nextIdRef = useRef(initialDraftSnippets.length + 1)

    useEffect(() => {
      setTitleValue(String(args.title ?? ''))
    }, [args.title])

    useEffect(() => {
      setSubtitleValue(String(args.subtitle ?? ''))
    }, [args.subtitle])

    useEffect(() => {
      setHintsLabelValue(String(args.hintsLabel ?? 'HINTS'))
    }, [args.hintsLabel])

    useEffect(() => {
      setBufferLabelValue(String(args.bufferLabel ?? 'BUFFER'))
    }, [args.bufferLabel])

    useEffect(() => {
      setBufferHelperTextValue(
        String(
          args.bufferHelperText ??
            '// Нажми COPY, чтобы скопировать текущую вкладку',
        ),
      )
    }, [args.bufferHelperText])

    useEffect(() => {
      setHintsValue(normalizeStoryHints(args.hints, initialDraftHints))
    }, [args.hints])

    const activeSnippet =
      snippets.find(snippet => snippet.id === activeSnippetId) || snippets[0]

    const onAddSnippetHandler = () => {
      const snippetId = `snippet-${nextIdRef.current}`
      nextIdRef.current += 1

      const newSnippet: CodeBrickSnippetType = {
        id: snippetId,
        code: '// New snippet',
        language: 'javascript',
      }

      setSnippets(previousSnippets => [...previousSnippets, newSnippet])
      setActiveSnippetId(snippetId)
    }

    const onRemoveSnippetHandler = (snippetId: string) => {
      setSnippets(previousSnippets => {
        const filteredSnippets = previousSnippets.filter(
          snippet => snippet.id !== snippetId,
        )
        const fallbackSnippetId = filteredSnippets[0]?.id || ''

        setActiveSnippetId(currentSnippetId => {
          if (currentSnippetId === snippetId) {
            return fallbackSnippetId
          }

          return currentSnippetId
        })

        return filteredSnippets
      })
    }

    const onSelectSnippetHandler = (snippetId: string) => {
      setActiveSnippetId(snippetId)
    }

    const onChangeSnippetCodeHandler = (value: string) => {
      setSnippets(previousSnippets =>
        previousSnippets.map(snippet =>
          snippet.id === activeSnippetId
            ? {
                ...snippet,
                code: value,
              }
            : snippet,
        ),
      )
    }

    const onChangeSnippetLanguageHandler = (value: string) => {
      setSnippets(previousSnippets =>
        previousSnippets.map(snippet =>
          snippet.id === activeSnippetId
            ? {
                ...snippet,
                language: value,
              }
            : snippet,
        ),
      )
    }

    const isEditMode = 'isEditMode' in args ? Boolean(args.isEditMode) : true
    const isEditModeDisabled =
      'isEditModeDisabled' in args ? Boolean(args.isEditModeDisabled) : false

    return (
      <Code
        {...args}
        title={titleValue}
        subtitle={subtitleValue}
        hintsLabel={hintsLabelValue}
        bufferLabel={bufferLabelValue}
        bufferHelperText={bufferHelperTextValue}
        hints={hintsValue}
        codeSnippets={snippets}
        activeSnippetId={activeSnippet?.id || ''}
        activeSnippet={activeSnippet}
        normalizedCodeSnippets={createNormalizedPreview(snippets)}
        isEditMode={isEditMode}
        isEditModeDisabled={isEditModeDisabled}
        onTitleChange={setTitleValue}
        onSubtitleChange={setSubtitleValue}
        onHintsLabelChange={setHintsLabelValue}
        onBufferLabelChange={setBufferLabelValue}
        onBufferHelperTextChange={setBufferHelperTextValue}
        onHintsChange={setHintsValue}
        onAddCodeSnippetTabHandler={onAddSnippetHandler}
        onRemoveCodeSnippetTabHandler={onRemoveSnippetHandler}
        onSelectCodeSnippetTabHandler={onSelectSnippetHandler}
        onChangeCodeSnippetValueHandler={onChangeSnippetCodeHandler}
        onChangeCodeSnippetLanguageHandler={onChangeSnippetLanguageHandler}
      />
    )
  },
}
