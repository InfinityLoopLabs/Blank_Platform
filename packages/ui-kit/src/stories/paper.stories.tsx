import type { Meta, StoryObj } from '@storybook/react'

import { Paper } from '@/components/atoms/Paper'

const meta = {
  title: 'Atoms/Paper',
  component: Paper,
  tags: ['autodocs'],
  render: args => (
    <div className="w-[520px] rounded-[var(--radius)] border border-(--border) bg-(--background) p-6">
      <Paper {...args} />
    </div>
  ),
  args: {
    className: 'max-w-xl',
    type: 'dark',
    isColored: false,
    children: (
      <div className="space-y-2">
        <p className="text-lg font-semibold">Paper Header</p>
        <p className="text-sm text-muted-foreground">
          Flat reusable surface with light/dark mode and optional colored overlay.
        </p>
      </div>
    ),
  },
  argTypes: {
    type: { control: 'select', options: ['dark', 'light'] },
    isColored: { control: 'boolean' },
  },
} satisfies Meta<typeof Paper>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariations: Story = {
  render: args => (
    <div className="grid w-[860px] grid-cols-3 gap-4 rounded-[var(--radius)] border border-(--border) bg-(--background) p-6">
      <Paper {...args} type="dark" isColored={false}>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Flat Dark</p>
          <p className="text-sm text-muted-foreground">type=&quot;dark&quot;, isColored=false</p>
        </div>
      </Paper>
      <Paper {...args} type="light" isColored={false}>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Flat Light</p>
          <p className="text-sm text-muted-foreground">type=&quot;light&quot;, isColored=false</p>
        </div>
      </Paper>
      <Paper {...args} isColored>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Colored</p>
          <p className="text-sm text-muted-foreground">isColored=true</p>
        </div>
      </Paper>
    </div>
  ),
}
