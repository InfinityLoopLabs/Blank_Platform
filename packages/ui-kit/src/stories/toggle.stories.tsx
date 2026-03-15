import type { Meta, StoryObj } from '@storybook/react'

import { Paper } from '@/components/atoms/Paper'
import { Toggle } from '@/components/atoms/Toggle'

const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Paper type="dark" className="w-[520px] p-6">
        <Story />
      </Paper>
    ),
  ],
  args: {
    leftLabel: 'Off',
    rightLabel: 'On',
    defaultChecked: false,
    disabled: false,
  },
  argTypes: {
    leftLabel: {
      control: 'text',
    },
    rightLabel: {
      control: 'text',
    },
    defaultChecked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    onChange: {
      action: 'change',
    },
  },
} satisfies Meta<typeof Toggle>

export default meta

type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}

export const WithoutLabels: StoryType = {
  args: {
    leftLabel: undefined,
    rightLabel: undefined,
  },
}
