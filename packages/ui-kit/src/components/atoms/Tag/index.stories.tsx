import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Paper } from '@/components/atoms/Paper'
import { Tag, TAG_TYPE_OPTIONS } from '@/components/atoms/Tag'
import { TYPOGRAPHY_COLOR_OPTIONS } from '@/components/atoms/Typography'

const meta = {
  title: 'Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Paper type="dark" className="w-[320px] p-6">
        <Story />
      </Paper>
    ),
  ],
  args: {
    label: 'NEW',
    type: 'default',
    color: undefined,
    textColor: undefined,
    isLoading: false,
    isEditModeEnabled: false,
    isEditModeDisabled: false,
    onLabelChange: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: TAG_TYPE_OPTIONS,
    },
    color: {
      control: 'select',
      options: TYPOGRAPHY_COLOR_OPTIONS,
    },
    textColor: {
      control: 'select',
      options: TYPOGRAPHY_COLOR_OPTIONS,
    },
    isLoading: {
      control: 'boolean',
    },
    isEditModeEnabled: {
      control: 'boolean',
    },
    isEditModeDisabled: {
      control: 'boolean',
    },
    onLabelChange: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Tag>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
