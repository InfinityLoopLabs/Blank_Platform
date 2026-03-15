import type { Meta, StoryObj } from '@storybook/react'

import { Paper } from '@/components/atoms/Paper'
import { TYPOGRAPHY_OPTIONS } from '@/components/atoms/Typography'
import { EditableTypography } from '@/components/molecules/EditableTypography'

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
    typography: 'Heading16',
    element: 'p',
    isEditModeDisabled: false,
    inputProps: {
      defaultValue: 'Click this text to edit',
      placeholder: 'Type value...',
    },
  },
  argTypes: {
    typography: {
      control: 'select',
      options: TYPOGRAPHY_OPTIONS,
    },
    element: {
      control: 'text',
    },
    inputProps: {
      control: false,
    },
  },
} satisfies Meta<typeof EditableTypography>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
