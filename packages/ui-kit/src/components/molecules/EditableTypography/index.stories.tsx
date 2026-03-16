import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { Paper } from '@/components/atoms/Paper'
import {
  TYPOGRAPHY_COLOR_OPTIONS,
  TYPOGRAPHY_OPTIONS,
} from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'

const elementOptions = ['span', 'p', 'div', 'h1', 'h2', 'h3', 'h4'] as const

const meta = {
  title: 'Molecules/EditableTypography',
  component: EditableTypography,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Paper type="dark" className="w-[520px] p-6">
        <Story />
      </Paper>
    ),
  ],
  args: {
    typography: 'Subheader',
    element: 'p',
    value: 'Click this text to edit',
    placeholder: 'Type value...',
    isEditModeDisabled: false,
    isLoading: false,
  },
  argTypes: {
    typography: {
      control: 'select',
      options: TYPOGRAPHY_OPTIONS,
    },
    color: {
      control: 'select',
      options: TYPOGRAPHY_COLOR_OPTIONS,
    },
    element: {
      control: 'select',
      options: elementOptions,
    },
    value: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    isLoading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof EditableTypography>

export default meta

type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {
  render: args => {
    const [{ value }, updateArgs] = useArgs()

    return (
      <EditableTypography
        {...args}
        value={value}
        onValueChange={nextValue => updateArgs({ value: nextValue })}
      />
    )
  },
}
