import { useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'

import { PAPER_PATTERN_COLOR_OPTIONS } from '@/components/atoms/Paper'
import { MathEquationBlock } from '@/components/molecules/MathEquationBlock'

const mathValidationExamples = String.raw`\[
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
\]
\[
x^2
\]
\[
a^b
\]
\[
\sqrt[3]{x}
\]`

const meta = {
  title: 'Molecules/MathEquationBlock',
  component: MathEquationBlock,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-[760px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'MathJax Validation',
    value: mathValidationExamples,
    isEditMode: false,
    isSubmitting: false,
    isLoading: false,
    actionLabel: 'Save',
    type: 'dark',
    isColored: true,
    isRoundedCornersDisabled: false,
    patternIcon: '',
    patternColor: 'chart-1',
    patternAngle: 0,
    patternSize: 28,
    patternOpacity: 0.14,
  },
  argTypes: {
    title: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    isEditMode: {
      control: 'boolean',
    },
    isSubmitting: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    actionLabel: {
      control: 'text',
    },
    type: {
      control: 'select',
      options: ['dark', 'light', 'gradient'],
    },
    isColored: {
      control: 'boolean',
    },
    isRoundedCornersDisabled: {
      control: 'boolean',
    },
    patternIcon: {
      control: 'text',
    },
    patternColor: {
      control: 'select',
      options: PAPER_PATTERN_COLOR_OPTIONS,
    },
    patternAngle: {
      control: 'number',
    },
    patternSize: {
      control: 'number',
    },
    patternOpacity: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
  },
} satisfies Meta<typeof MathEquationBlock>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {
  render: args => {
    const [{ title, value, isSubmitting }, updateArgs] = useArgs()
    const submitTimeoutRef = useRef<number | null>(null)

    const onSubmit = () => {
      updateArgs({ isSubmitting: true })

      if (submitTimeoutRef.current !== null) {
        window.clearTimeout(submitTimeoutRef.current)
      }

      submitTimeoutRef.current = window.setTimeout(() => {
        updateArgs({ isSubmitting: false })
      }, 900)
    }

    return (
      <MathEquationBlock
        {...args}
        title={String(title ?? '')}
        value={String(value ?? '')}
        isSubmitting={Boolean(isSubmitting)}
        onChangeTitle={nextValue => updateArgs({ title: nextValue })}
        onChangeValue={nextValue => updateArgs({ value: nextValue })}
        onSubmit={onSubmit}
      />
    )
  },
}

export const EditMode: StoryType = {
  args: {
    isEditMode: true,
  },
}

export const Loading: StoryType = {
  args: {
    isLoading: true,
  },
}

export const CubeRootOnly: StoryType = {
  args: {
    title: 'Cube Root Check',
    value: String.raw`\[
\sqrt[3]{x^3 + y^3}
\]`,
  },
}
