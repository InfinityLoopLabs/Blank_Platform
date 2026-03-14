import type { Meta, StoryObj } from '@storybook/react'
import { ArrowRight, Sparkles } from 'lucide-react'

import { GlowingButton as Button } from '@/components/atoms/GlowingButton'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  render: args => (
    <div className="w-[520px] rounded-[var(--radius)] border border-(--border) bg-(--card) p-6">
      <Button {...args} />
    </div>
  ),
  args: {
    children: 'Infinityloop',
    state: 'default',
  },
  argTypes: {
    state: { control: 'select', options: ['default', 'active'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const WithTwoIcons: Story = {
  args: {
    leftIcon: <Sparkles className="size-4" />,
    rightIcon: <ArrowRight className="size-4" />,
  },
}
