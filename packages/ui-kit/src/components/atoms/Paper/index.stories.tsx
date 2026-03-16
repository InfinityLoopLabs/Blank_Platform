import type { Meta, StoryObj } from '@storybook/react'

import { Paper } from '@/components/atoms/Paper'
import { Typography } from '@/components/atoms/Typography'

const meta = {
  title: 'Atoms/Paper',
  component: Paper,
  tags: ['autodocs'],
  render: args => (
    <div className="w-[520px] rounded-[var(--radius)] border border-(--border) bg-(--background) p-6">
      <Paper {...args}>
        <div className="space-y-2">
          <Typography typography="Heading" element="h4" isLoading={Boolean(args.isLoading)}>
            Infinity Loop Surface Title
          </Typography>
          <Typography typography="Subheader" element="p" isLoading={Boolean(args.isLoading)}>
            This content is controlled by Paper storybook controls.
          </Typography>
        </div>
      </Paper>
    </div>
  ),
  args: {
    className: 'max-w-xl',
    type: 'dark',
    isColored: false,
    isLoading: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['dark', 'light'],
    },
    isColored: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Paper>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
