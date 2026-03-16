import type { Meta, StoryObj } from '@storybook/react'

import { Paper } from '@/components/atoms/Paper'
import { Slider } from '@/components/atoms/Slider'

const demoSlides = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega'].map(label => (
  <Paper key={label} type="dark" className="min-h-[200px] w-full p-6">
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted/30 text-3xl font-semibold">
      {label}
    </div>
  </Paper>
))

const meta = {
  title: 'Atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-[680px] p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    slides: demoSlides,
    slidesPerView: 1,
    spaceBetween: 16,
    isLoopEnabled: false,
    isPaginationVisible: true,
    isNavigationEnabled: true,
    isArrowsVisible: true,
    isMousewheelEnabled: true,
    isKeyboardEnabled: true,
    isGrabCursorVisible: true,
    isFreeScrollEnabled: false,
  },
  argTypes: {
    slides: {
      table: { disable: true },
    },
    onSlideChange: {
      table: { disable: true },
    },
    slidesPerView: {
      control: {
        type: 'number',
        min: 1,
        max: 4,
        step: 1,
      },
    },
    spaceBetween: {
      control: {
        type: 'number',
        min: 0,
        max: 48,
        step: 2,
      },
    },
    isLoopEnabled: {
      control: 'boolean',
    },
    isPaginationVisible: {
      control: 'boolean',
    },
    isNavigationEnabled: {
      control: 'boolean',
    },
    isArrowsVisible: {
      control: 'boolean',
    },
    isMousewheelEnabled: {
      control: 'boolean',
    },
    isKeyboardEnabled: {
      control: 'boolean',
    },
    isGrabCursorVisible: {
      control: 'boolean',
    },
    isFreeScrollEnabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Slider>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}

export const TwoSlidesPerView: StoryType = {
  args: {
    slidesPerView: 2,
  },
}
