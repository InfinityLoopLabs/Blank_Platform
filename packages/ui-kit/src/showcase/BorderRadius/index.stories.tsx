import type { Meta, StoryObj } from '@storybook/react'

import {
  BorderRadiusShowcase,
  RADIUS_CLASS_OPTIONS,
} from '@/showcase/BorderRadius'

const meta = {
  title: 'Design/Border Radius',
  component: BorderRadiusShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    radiusClassName: 'rounded-(--radius)',
  },
  argTypes: {
    radiusClassName: {
      control: 'select',
      options: RADIUS_CLASS_OPTIONS,
    },
  },
} satisfies Meta<typeof BorderRadiusShowcase>

export default meta
type StoryType = StoryObj<typeof meta>

export const Playground: StoryType = {}
