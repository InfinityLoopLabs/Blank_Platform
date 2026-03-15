import type { Meta, StoryObj } from '@storybook/react'

import { OfferCountdown } from '@/showcase/OfferCountdown'

const meta = {
  title: 'Showcase/Offer Countdown',
  component: OfferCountdown,
  parameters: {
    docs: { disable: true },
    controls: { disable: true },
  },
  render: args => <OfferCountdown {...args} />,
  args: {
    ctaText: 'Успей купить',
    imageOrientation: 'vertical',
  },
} satisfies Meta<typeof OfferCountdown>

export default meta

type StoryType = StoryObj<typeof meta>

export const Vertical: StoryType = {}

export const Horizontal: StoryType = {
  args: {
    imageOrientation: 'horizontal',
  },
}
