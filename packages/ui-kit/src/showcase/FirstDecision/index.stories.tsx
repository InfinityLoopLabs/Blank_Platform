import type { Meta, StoryObj } from '@storybook/react'

import { FirstDecision } from '@/showcase/FirstDecision'

const meta = {
  title: 'Showcase/Form Example',
  component: FirstDecision,
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
  render: args => <FirstDecision {...args} />,
  args: {
    cancelText: 'Cancel',
    acceptText: 'Accept',
  },
} satisfies Meta<typeof FirstDecision>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
